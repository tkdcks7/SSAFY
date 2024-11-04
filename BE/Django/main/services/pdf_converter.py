from pdf2image import convert_from_bytes
from typing import List

class PdfConverter:
    def convert_pdf_to_images(pdf_file) -> List:
        """pdf의 각 페이지를 이미지로 변환.
        :param pdf_file: serializers.FileField로 받은 pdf파일을 바로 인자로 넣으면 된다.
        :type pdf_file: File
        :return: PIL 이미지 객체 리스트
        """
        pdf_bytes = pdf_file.read()
        images = convert_from_bytes(pdf_bytes, fmt='jpeg') # OCR 인식이 잘 안되면 dpi=300으로 설정해볼것
        return images