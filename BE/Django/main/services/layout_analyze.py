import io
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
import os
from config.settings.base import STATIC_ROOT

class LayoutAnalyze:

    # matplotlib 백엔드를 Agg로 설정하여 GUI 의존성을 없앱니다.
    matplotlib.use('Agg')
    # .npz 데이터 복원 후 이미지 확인하는 코드
    def load_and_check_npz(npz_file):
        # 바이트 데이터를 .npz로 로드하고 데이터를 메모리에 저장
        with io.BytesIO(npz_file) as buffer:
            with np.load(buffer, allow_pickle=True) as data:
                # metadata 추출
                metadata = data['metadata']
                # 이미지 배열 데이터 추출
                arrays = [data[str(i)] for i in range(len(data.files) - 1)]

        images_with_labels = [] # 플롯
        page_num = 1 # 플롯
        for page in metadata:
            images_with_labels.append((f'Page: {page_num}', None)) # 페이지 레이블
            for section in page['sections']:
                if section["type"] in ["text", "title"]:
                    section['text'] = arrays[section['text']]
                    images_with_labels.append((None, section['text'])) # 레이블
                elif section['type'] == 'image':
                    section['image'] = arrays[section['image']]
                    images_with_labels.append((None, section['image'])) # 레이블
            page_num += 1  # 플롯

        # 전체 이미지 플롯 생성
        num_images = len(images_with_labels)
        fig, axes = plt.subplots(num_images, 1, figsize=(6, 3 * num_images))
        
        # 각 이미지와 레이블을 서브플롯에 추가
        for i, (label, img) in enumerate(images_with_labels):
            if label is not None:
                axes[i].text(0.5, 0.5, label, ha='center', va='center', fontsize=16, weight='bold')
                axes[i].axis('off')
            elif img is not None:
                axes[i].imshow(img)
                axes[i].axis('off')
        
        plt.tight_layout()
        fig.savefig(os.path.join(STATIC_ROOT, 'report.png'))
        
        return metadata