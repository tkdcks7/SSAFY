# 임시 클래스임 -> 테스트 성공시 원래 파일 내용 대체함
import concurrent.futures
import requests
from config.settings import base
from datetime import datetime
from typing import Dict, List
import uuid
import logging
from dataclasses import dataclass
import numpy as np
import base64
import io
from PIL import Image
import concurrent
import os
from .stack import Stack


@dataclass
class OcrImage:
    data: str # base64 -> 일단은 전체 텍스트 이미지를 base64로 바꾼다. 
    name: str # pageNum_sectionNum
    size: int

class OcrParallel:
    def __init__(self):
        self.invoke_url = base.NAVER_OCR_INVOKE_URL
        self.secret_key = base.NAVER_OCR_SECRET_KEY
        self.max_batch_size = 45_000_000
        self.max_images_per_request = 1
        self.max_workers = 4

    def create_request_payload(self, images: List[Dict]) -> Dict:
        return {
            'version': 'V2',
            'requestId': str(uuid.uuid4()),
            'timestamp': int(datetime.now().timestamp()),
            'lang': 'ko',
            'images': images,
            'enableTableDetection': False
        }
    
    def make_ocr_request(self, images: List[Dict]) -> Dict: 
        """
        네이버 ocr로 요청보낸 후 response 반환
        """
        headers = {
            'X-OCR-SECRET': self.secret_key,
            'Content-Type': 'application/json'
        }

        payload = self.create_request_payload(images)

        try:
            response = requests.post(
                url=self.invoke_url,
                headers=headers,
                json=payload,
                timeout=30
            )

            if response.status_code == 200:
                return response.json()
            
            logging.warning(f"OCR 실패. 코드: {response.status_code}")
            logging.warning(f"에러 본문: {response.text}")

        except requests.exceptions.RequestException as e:
            logging.error(f"OCR 요청 실패: {str(e)}")
            return {}
    
    def ndarray_to_base64(self, image: np.ndarray) -> str:
        """np.ndarray를 base64로 변환하는 함수"""
        if image is not None and image.size > 0:
            try:
                PIL_image = Image.fromarray(image)
                buffer = io.BytesIO()
                PIL_image.save(buffer, format='JPEG')
                buffer.seek(0)
                return base64.b64encode(buffer.read()).decode('utf-8')
            except Exception as e:
                print(f'base64 변환 중 에러 발생: {str(e)}')
                return ''
        else:
            return ''
        
    def make_image_list(self, pages: List[Dict]) -> List[OcrImage]:
        """
        pages에서 텍스트 이미지가 담긴 리스트를 추출해서 반환
        image_text_converter로 이동해야 함
        반환값: image_data(base64), image_name(pageNum_sectionNum 형태)
        """
        text_images = []
        for page in pages:
            page_num = page.get('page_number', 0)
            for section in page.get('sections', []):
                if section['type'] in ['text', 'title']:
                    image_name = f'{page_num}_{section.get('sequence_number', 0)}'
                    image_data = self.ndarray_to_base64(section.get('text', None))
                    image_size = len(image_data) * 3 // 4
                    text_images.append(OcrImage(image_data, image_name, image_size))

        return text_images
    
    def make_image_batch(self, images: List[OcrImage]) -> List[List[Dict]]:
        """용량 고려해서 이미지 배치 생성"""
        current_batch = []
        current_batch_size = 0
        batches = []

        for image in images:
            # 45mb가 넘어가거나 10장 이상 추가하는 경우
            if (current_batch_size + image.size > self.max_batch_size or 
                len(current_batch) >= self.max_images_per_request):
                if current_batch:
                    batches.append(current_batch)
                current_batch = []
                current_batch_size = 0
            
            # current batch에 이미지 추가
            current_batch.append({
                'format': 'jpg',
                'name': image.name,
                'data': image.data
            })
            current_batch_size += image.size
        
        if current_batch:
            batches.append(current_batch)
        
        return batches
    
    def quotation_mark_validator(self, texts: List) -> List:
        """
        유효하지 않은 따옴표 쌍을 유효한 따옴표 쌍으로 교정.
        가정 : ocr이 쌍따옴표를 따옴표로 인식했거나 그 반대로 인식했다고 가정함
        한계 : ocr이 쌍따옴표 또는 따옴표를 인식하지 못하고 누락하는 경우는 처리하지 못함
        """
        result = []
        stack = Stack()
        for text in texts:
            # 텍스트를 ""로 감싼 경우
            if text.startswith('"') and text.endswith('"'):
                pass
            # 텍스트를 ''로 감싼 경우
            elif text.startswith("'") and text.endswith("'"):
                pass
            # 텍스트가 "로 시작하는 경우
            elif text.startswith('"'):
                stack.push('"')
            # 텍스트가 '로 시작하는 경우
            elif text.startswith("'"):
                stack.push("'")
            # 텍스트가 "로 끝나는 경우
            elif text.endswith('"'):
                if not stack.is_empty() and stack.peek() == '"': # 정상
                    stack.pop()
                elif stack.is_empty(): # 뭔가가 누락된 경우인데... 에러 방지 위해 꼼수쓰겠음
                    text = '"' + text
                elif stack.peek() == "'": # 잘못 인식한 경우 
                    text = text[:-1] + "'"
                    stack.pop()
            # 텍스트가 '로 끝나는 경우
            elif text.endswith("'"):
                if not stack.is_empty() and stack.peek() == "'": # 정상
                    stack.pop()
                elif stack.is_empty(): # 뭔가가 누락된 경우...
                    text = "'" + text
                elif stack.peek() == '"': # 잘못 인식한 경우
                    text = text[:-1] + '"'
                    stack.pop()
            
            result.append(text)
        
        if not stack.is_empty():
            result[-1] = result[-1] + stack.pop()

        return result
    
    def make_text_list(self, ocr_result: Dict) -> Dict:
        """
        OCR의 결과를 text의 리스트로 가공한 후, 딕셔너리에 추가
        ocr_result : naver ocr response의 payload
        """
        texts_dict = {}
        for image in ocr_result.get('images', []):
            name = image.get('name', '')

            # OCR 결과 파싱해 텍스트 추출
            texts = []
            current_sentences = ''
            for field in image.get('fields', []):
                text = field.get('inferText', '')
                current_sentences += text + ' '

                if '.' in text or '?' in text or '!' in text:
                    texts.append(current_sentences.strip())
                    current_sentences = ""
            if current_sentences:
                texts.append(current_sentences.strip())

            # 따옴표 검사
            texts = self.quotation_mark_validator(texts)

            # 딕셔너리에 추가
            texts_dict[name] = texts
        
        return texts_dict


    def process_parallel_ocr(self, batches:List[List[Dict]]) -> Dict:
        """
        멀티스레드를 이용해 ocr요청 병렬로 처리
        ocr 서버에서 받은 응답은 texts배열로 가공한 후 pagenum_secnum: List[str]형태로 Dict에 저장
        """
        # 결과를 담을 딕셔너리
        texts_dict = {}

        # 병렬 처리
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Future: batch 저장
            future_to_batch = {}
            for batch in batches:
                future = executor.submit(self.make_ocr_request, batch)
                future_to_batch[future] = batch
            
            # 완료된 작업 결과 수집 -> 텍스트 처리
            for future in concurrent.futures.as_completed(future_to_batch):
                batch = future_to_batch[future]
                try:
                    result = future.result() # ocr response.json()
                    result_dict = self.make_text_list(result) # pagenum_secnum: texts 반환
                    texts_dict.update(result_dict) # 딕셔너리 병합
                except Exception as e:
                    logging.error(f"배치처리 중 문제 발생: {str(e)}")
            
            return texts_dict

    def process_book(self, input_data: Dict) -> Dict:
        """
        전체 책 데이터 처리 - 병렬/배치 처리 적용
        """
        output_data = {
            'metadata': input_data['metadata'],
            'pages': []
        }

        # text image를 추출해서 리스트로 만들기
        image_list = self.make_image_list(input_data.get('pages', []))
        logging.info(f"이미지 리스트가 비었나? {bool(image_list)}")

        # 배치 생성
        batch_list = self.make_image_batch(image_list)

        # 병렬 처리 (ocr 요청)
        texts_dict = self.process_parallel_ocr(batch_list)

        # pages 만드는 작업
        for page in input_data.get('pages', []):
            processed_page = {
                'page_number': page.get('page_number', 0),
                'sections': []
            }

            for section in page.get('sections', []):
                if section['type'] in ['text', 'title']:
                    image_name = f'{processed_page['page_number']}_{section['sequence_number']}'
                    texts = texts_dict[image_name]
                    processed_section = {
                        'type': section.get('type', 'text'),
                        'sequence': section.get('sequence_number', 0),
                        'content': {
                            'texts': texts
                        }
                    }
                elif section['type'] == 'image':
                    processed_section = {
                        'type': 'image',
                        'sequence': section.get('sequence_number', 0),
                        'content': {
                            'image': section.get('image', None)
                        }
                    }
                else:
                    continue
                processed_page['sections'].append(processed_section)
            
            # 만든 페이지 추가
            output_data['pages'].append(processed_page)
        
        return output_data