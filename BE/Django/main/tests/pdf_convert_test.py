import unittest
from main.services import PdfConverter
from typing import Dict, List
from config.settings.base import STATIC_ROOT
import io
import os

class PdfConvertTest(unittest.TestCase):
    def setUp(self):
        self.static_path = STATIC_ROOT

    def test_pdf_converter(self):
        with open(os.path.join(self.static_path, 'The Snow Fairy Example.pdf'), 'rb') as pdf_file:
            pdf_data = io.BytesIO(pdf_file.read())

        # pdf를 이미지 리스트로 변환
        images = PdfConverter.convert_pdf_to_images(pdf_data)

        # 이미지를 로컬에 저장해보기 - 성공 : 잘 변환됨
        for i, image in enumerate(images):
            path = os.path.join(self.static_path, f'image_{i+1}.jpg')
            image.save(path, 'JPEG')
