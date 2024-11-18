from .ocr_service import NaverOcrClient
from typing import Dict, List
import base64
from .stack import Stack
import io
import numpy as np
from PIL import Image

class ImageToTextConverter:
    def __init__(self):
        self.ocr_client = NaverOcrClient()

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

    def process_text_section(self, section: Dict, page_number: int) -> Dict:
        """
        텍스트 섹션 처리 - 텍스트를 ocr로 처리한다. 
        섹션 하나만 처리하는 함수. 여러 페이지를 동시에 처리하는건 나중에 구현
        """
        # base64 이미지 데이터를 OCR로 처리
        image_file = section.get('text', None) # numpy array 이미지
        if image_file is not None and image_file.size > 0: # numpy array가 비어있는지 확인하려면 이렇게 해야함..
            try:
                img = Image.fromarray(image_file) # numpy array -> PIL Image
                buffer = io.BytesIO()
                img.save(buffer, format='JPEG') # JPG로 변환해 버퍼에 저장
                buffer.seek(0) # 파일 포인터를 처음으로 이동
                image_data = base64.b64encode(buffer.read()).decode('utf-8')
            except Exception as e:
                print(f"error: {e}")
                image_data = ''
        else:
            image_data = ''
        image_name = f"{page_number}_{section.get('sequence_number', 0)}"
        ocr_result = self.ocr_client.process_image(image_data, image_name) #ocr 처리

        # OCR 결과 파싱해 텍스트 추출
        texts = []
        current_sentences = ""
        for image in ocr_result.get('images', [{}]):
            for field in image.get('fields', [{}]):
                text = field.get('inferText', '')
                current_sentences += text + ' '

                if '.' in text or '?' in text or '!' in text:
                    texts.append(current_sentences.strip())
                    current_sentences = ""
        
        if current_sentences:
            texts.append(current_sentences.strip())
        
        # 따옴표, 쌍따옴표 검사, 수정
        texts = self.quotation_mark_validator(texts)

        # 리턴
        return {
            'type': section.get('type', 'text'),
            'sequence': section.get('sequence_number', 0),
            'content': {
                'texts': texts
            }
        }

    def process_image_section(self, section: Dict) -> Dict:
        """
        이미지 섹션 처리
        """
        return {
            'type': 'image',
            'sequence': section.get('sequence_number', 0),
            'content': {
                'image': section.get('image', None)
            }
        }

    def process_book(self, input_data: Dict) -> Dict:
        """
        전체 책 데이터 처리
        """
        output_data = {
            'metadata': input_data['metadata'],
            'pages': []
        }

        for page in input_data.get('pages', [{}]):
            processed_page = {
                'page_number': page.get('page_number', 0),
                'sections': []
            }

            for section in page.get('sections', [{}]):
                if section['type'] in ['text', 'title']:
                    processed_section = self.process_text_section(section, page.get('page_number', 0))
                elif section['type'] == 'image':
                    processed_section = self.process_image_section(section)
                else:
                    continue

                processed_page['sections'].append(processed_section)

            output_data['pages'].append(processed_page)

        return output_data


