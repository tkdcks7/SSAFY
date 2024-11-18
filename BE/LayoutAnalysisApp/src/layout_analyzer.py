# .npz로 파일 보내기
import cv2
from doclayout_yolo import YOLOv10
from doclayout_yolo.utils.plotting import save_one_box
from huggingface_hub import hf_hub_download
import matplotlib.pyplot as plt
import numpy as np
import torch
import io
import os
from PIL import Image

# GPU 환경설정
# os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
# os.environ["CUDA_VISIBLE_DEVICES"] = "4"

# 이미지 업로드를 위한 함수
def process_image_file(filename):
    """
    이미지 파일을 numpy array로 변환
    Args:
        filename: 파일 객체(UploadFile) 또는 파일 경로(str)
    Returns:
        numpy.ndarray
    """
    # 절대 경로 지정
    base_dir = os.path.join("..", "staticfiles")

    # 로컬 개발용
    if isinstance(filename, str):
        return cv2.imread(os.path.join(base_dir, filename))
    # API용 (파일 객체인 경우)
    else:
        # 바이트 데이터로 변환
        if hasattr(filename, "read"):
            # UploadFile인 경우
            file_bytes = filename.read()
        else:
            # 이미 bytes인 경우
            file_bytes = filename

        # PIL Image로 변환
        image = Image.open(io.BytesIO(file_bytes))
        # numpy array로 변환
        return np.array(image)


# 결과 시각화를 위한 함수
def display_result(image_path):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    plt.figure(figsize=(15, 15))
    plt.imshow(img)
    plt.axis("off")
    plt.show()


# numpy 배열을 BytesIO 객체로 변환
def numpy_to_bytesio(numpy_array):
    bytes_io = io.BytesIO()  # BytesIO 객체 생성
    np.save(bytes_io, numpy_array)  # NumPy 배열을 바이트로 직렬화하여 저장
    bytes_io.seek(0)  # 파일 포인터를 처음으로 이동
    return bytes_io


def filter_overlapping_boxes(boxes, classes, threshold=0.1):
    """
    같은 클래스 내에서 많이 겹치거나 포함된 박스들을 필터링
    boxes: xyxy 좌표
    classes: class id
    threshold: IoU 임계값
    """
    coords = boxes.cpu().numpy()
    classes = classes.cpu().numpy()
    indices_to_keep = []

    # 박스 면적 계산
    def box_area(box):
        return (box[2] - box[0]) * (box[3] - box[1])

    # IoU 계산
    def compute_iou(box1, box2):
        x1 = max(box1[0], box2[0])
        y1 = max(box1[1], box2[1])
        x2 = min(box1[2], box2[2])
        y2 = min(box1[3], box2[3])

        if x2 < x1 or y2 < y1:
            return 0.0

        intersection = (x2 - x1) * (y2 - y1)

        area1 = box_area(box1)
        area2 = box_area(box2)

        union = area1 + area2 - intersection
        return intersection / union if union > 0 else 0

    # 각 클래스별로 처리
    unique_classes = np.unique(classes)
    for cls in unique_classes:
        # 현재 클래스의 박스들 찾기
        cls_mask = classes == cls
        cls_boxes = coords[cls_mask]
        cls_indices = np.where(cls_mask)[0]

        # 면적 기준으로 내림차순 정렬
        areas = [box_area(box) for box in cls_boxes]
        sorted_indices = sorted(range(len(areas)), key=lambda k: areas[k], reverse=True)

        # 큰 박스부터 처리
        for i in sorted_indices:
            # 이미 처리된 박스들과 IoU 확인
            keep = True
            for kept_idx in indices_to_keep:
                # 다른 클래스면 스킵
                if classes[kept_idx] != cls:
                    continue

                iou = compute_iou(cls_boxes[i], coords[kept_idx])
                if iou > threshold:
                    keep = False
                    break

            if keep:
                indices_to_keep.append(cls_indices[i])

    return sorted(indices_to_keep)


def type_converter(type) -> str:
    """
    Args:
        type (str): "plain text" | "title" | "figure" | others

    Returns:
        (str): "text" | "title" | "image" | None
    """
    if type == "plain text":
        return "text"
    elif type == "title":
        return "title"
    elif type == "figure":
        return "image"
    else:
        return None


def get_page_info(page_number, result, image_index) -> tuple:
    """
    분석된 Result객체를 바탕으로 레이아웃 이미지 크롭해서 반환하는 함수
    Args:
        page_number (int): 몇번째 페이지
        result (doclayout_yolo.engine.Results): predict함수의 결과로 반환된 리스트의 Results 객체
        image_index: 각 이미지의 전체 인덱스

    Returns:
        (page, images, image_index)
        - page (dict): page_number, sections(list of dict: type(title | text | image), image(required: False), text(required: False), sequence_number)
        - images (List[numpy array]): 이미지 리스트
        - image_index (int)
    """

    # 변수에 필요한 정보 할당
    boxes = result.boxes
    classes = boxes.cls
    coords = boxes.xyxy
    n_boxes = len(boxes)

    # 겹치는 박스(레이아웃) 필터링
    filtered_indices = filter_overlapping_boxes(coords, classes)

    # 필터링된 결과만 사용
    coords = coords[filtered_indices].cpu().numpy()
    classes = classes[filtered_indices].cpu().numpy().astype(int)

    # 위에서 아래 방향으로 결과 정렬 (분석하는 책 페이지가 1개의 칼럼으로 구성된 일반 도서라고 가정)
    order = np.argsort(coords[:, 1])

    # 분석된 레이아웃 요소를 크롭 (디버깅용으로 화면에 표시하는 로직 포함)
    # plt.figure(figsize=(15, 3 * ((n_boxes + 3) // 4)))

    sections = []
    images = []
    for idx, i in enumerate(order):
        section = {}
        box = torch.from_numpy(coords[i])
        class_id = classes[i]

        # 섹션 인덱스 설정
        section["sequence_number"] = idx

        # 섹션 타입 설정. 만약 쓸모없는 정보가 들어오면 continue
        section_type = type_converter(result.names[class_id])
        if section_type == None:
            continue
        section["type"] = section_type

        # 크롭 -> save_one_box: numpy.ndarray 반환
        cropped = save_one_box(
            box.cpu(),
            result.orig_img.copy(),
            gain=1.02,
            pad=10,
            square=False,
            save=False,
            BGR=True,
        )

        # 크롭된 이미지 저장
        images.append(cropped)

        # 이미지 인덱스 저장
        if section_type in ["title", "text"]:
            section["text"] = image_index
        else:
            section["image"] = image_index

        image_index += 1

        # 섹션 저장
        sections.append(section)

        # subplot에 표시 (디버깅용)
        # plt.subplot(((n_boxes + 3) // 4), 4, idx + 1)
        # plt.imshow(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
        # plt.axis("off")
        # plt.title(section_type)

    # 플롯 출력 (디버깅용)
    # print(f"================={page_number}번째 페이지=================")
    # plt.tight_layout()
    # plt.show()

    page = {"page_number": page_number, "sections": sections}
    return (page, images, image_index)


# 메인 함수
def get_page_layouts(pages) -> tuple:
    """
    주어진 페이지의 레이아웃을 분석한 결과를 리턴
    Args:
        pages (list[images]): 이미지 리스트

    Returns:
        tuple (list, list)
        - pages (list): list of page(dict(page_number, sections))
        - layout_images (list): list of numpy arrays
    """

    # 1. DocLayout-YOLO 모델 불러오기
    filepath = hf_hub_download(
        repo_id="juliozhao/DocLayout-YOLO-DocStructBench",
        filename="doclayout_yolo_docstructbench_imgsz1024.pt",
    )
    model = YOLOv10(filepath)

    # 2. 레이아웃 분석 (배치처리 가능!!)
    device = "cuda:0" if torch.cuda.is_available() else "cpu"

    results = model.predict(
        pages, imgsz=1024, conf=0.2, device=device, batch=len(pages)
    )

    # 3. 페이지마다 이미지 크롭하기
    pages = []
    layout_images = []
    image_index = 0
    for idx, page in enumerate(results, 1):
        page, images, image_index = get_page_info(idx, page, image_index)
        pages.append(page)
        layout_images.extend(images)

    return (pages, layout_images)


# .npz 파일로 저장 및 다운로드
def save_as_npz(metadata, arrays):
    """
    다음과 같이 사용하면 된다.
    @app.get("/get_npz")
    async def get_npz():
        content = create_npz(metadata, arrays)
        return Response(
            content=content,
            media_type='application/octet-stream',
            headers={
                'Content-Disposition': 'attachment; filename=result.npz'
            }
        )
    """
    # timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    # filename = f"result_{timestamp}.npz"

    save_dict = {"metadata": metadata}
    for i, arr in enumerate(arrays):
        save_dict[str(i)] = arr

    buffer = io.BytesIO()
    np.savez_compressed(buffer, **save_dict)
    buffer.seek(0)

    return buffer.read()


# .npz 데이터 복원 후 이미지 확인하는 코드
def load_and_check_npz(npz_file):
    """
    # Django에서 사용할 때:
    response = requests.get('http://fastapi-server/get_npz')
    if response.status_code == 200:
        metadata = load_and_check_npz(response.content)
    """
    # 바이트 데이터(HTTP 응답으로 받은 데이터)를 .npz로 로드
    with io.BytesIO(npz_file) as buffer:
        data = np.load(buffer, allow_pickle=True)

    # 데이터 복원 및 이미지 확인 (plt 부분)
    metadata = data["metadata"]
    arrays = [data[str(i)] for i in range(len(data.files) - 1)]
    for page in metadata:
        for section in page["sections"]:
            if section["type"] in ["text", "title"]:
                section["text"] = arrays[section["text"]]
                plt.imshow(section["text"])
                plt.axis("off")
                plt.show()
            elif section["type"] == "image":
                section["image"] = arrays[section["image"]]
                plt.imshow(section["image"])
                plt.axis("off")
                plt.show()

    return metadata
