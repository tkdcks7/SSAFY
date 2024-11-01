from .ocr_service import NaverOcrClient
from typing import Dict
import base64

class ImageToTextConverter:
    def __init__(self):
        self.ocr_client = NaverOcrClient()

    def process_text_section(self, section: Dict, page_number: int) -> Dict:
        """
        텍스트 섹션 처리 - 텍스트를 ocr로 처리한다. 
        섹션 하나만 처리하는 함수. 여러 페이지를 동시에 처리하는건 나중에 구현
        """
        # base64 이미지 데이터를 OCR로 처리
        image_file = section.get('text', None)
        if image_file:
            try:
                image_file.seek(0) # 파일 포인터를 처음으로 이동
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
            except Exception as e:
                print(f"error: {e}")
                image_data = ''
        else:
            image_data = ''
        image_name = f"{page_number}_{section.get('sequence_number', 0)}"
        ocr_result = self.ocr_client.process_image(image_data, image_name)

        # OCR 결과 파싱해 텍스트 추출
        texts = []
        current_sentences = ""
        for image in ocr_result.get('images', [{}]):
            for field in image.get('fields', [{}]):
                text = field.get('inferText', '')
                current_sentences += text + ' '

                if '.' in text:
                    texts.append(current_sentences.strip())
                    current_sentences = ""
        
        if current_sentences:
            texts.append(current_sentences.strip())
        
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
                'layout': page.get('layout', 'text_only'),
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


