import unittest
from main.services import ImageToTextConverter, InitialEbookConverter
import io
from config.settings.base import STATIC_ROOT
import os

class IntegrationTest(unittest.TestCase):
    def setUp(self):
        self.static_path = STATIC_ROOT
        self.image_converter = ImageToTextConverter()
        self.ebook_converter = InitialEbookConverter()

    def test_integration(self):
        with open(os.path.join(self.static_path, 'title_image.jpg'), 'rb') as title_file:
            title_data = io.BytesIO(title_file.read())
        with open(os.path.join(self.static_path, 'paragraph_image.jpg'), 'rb') as text_file:
            text_data = io.BytesIO(text_file.read())
        with open(os.path.join(self.static_path, 'illust.jpg'), 'rb') as illust_file:
            illust_data = io.BytesIO(illust_file.read())
        with open(os.path.join(self.static_path, 'cover.jpg'), 'rb') as cover_file:
            cover_data = io.BytesIO(cover_file.read())
        with open(os.path.join(self.static_path, 'paragraph_image_2.jpg'), 'rb') as text_2_file:
            text_2_data = io.BytesIO(text_2_file.read())

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
                            "sequence_number": 0
                        }
                    ]
                },
                {
                    "page_number": 3,
                    "layout": "text_only",
                    "sections": [
                        {
                            "type": "text",
                            "text": text_2_data,
                            "sequence_number": 0
                        }
                    ]
                }
            ]
        }

        ocr_result = self.image_converter.process_book(data)
        book_result = self.ebook_converter.make_book(ocr_result)
        print(book_result)