from django.test import TestCase
import unittest
from main.services.image_text_converter import ImageToTextConverter
from main.services.ocr_service import NaverOcrClient
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
import io
from datetime import datetime

# Create your tests here.
class TestImageToTextConverter(unittest.TestCase):
    def setUp(self):
        self.converter = ImageToTextConverter()
    
    def test_ocr(self):
        # 이미지 로드
        with open('./staticfiles/paragraph_image.jpg', 'rb') as title_file:
            title_data = io.BytesIO(title_file.read())
        
        section = {
            'type': 'text',
            'text': title_data,
            'sequence_number': 1
        }

        result = self.converter.process_text_section(section, 1)

        print(result['content']['texts'])

    def test_book_processor(self):
        with open('./staticfiles/title_image.jpg', 'rb') as title_file:
            title_data = io.BytesIO(title_file.read())
        with open('./staticfiles/paragraph_image.jpg', 'rb') as text_file:
            text_data = io.BytesIO(text_file.read())
        with open('./staticfiles/illust.jpg', 'rb') as illust_file:
            illust_data = io.BytesIO(illust_file.read())
        with open('./staticfiles/cover.jpg', 'rb') as cover_file:
            cover_data = io.BytesIO(cover_file.read())

        data = {
            "metadata": {
                "title": "책 제목",
                "author": "저자",
                "cover": cover_data,
                "created_at": "2024-10-30T12:00:00Z",
                "category_id": "000"
            },
            "pages": [
                {
                    "page_number": 1,
                    "layout": "text_only",
                    "sections": [
                            {
                            "type": "title",
                            "text": title_data,
                            "sequence_number": 0,
                        },
                        {
                            "type": "text",
                            "text": text_data,
                            "sequence_number": 1,
                        }
                    ]
                },
                {
                        "page_number": 2,
                        "layout": "image_only",
                        "sections": [
                                {
                            "type": "image",
                            "image": illust_data,
                            "sequence_number": 0,
                        }
                        ]
                }
            ]
        }

        result = self.converter.process_book(data)
        print(result)

