from pdf2image import convert_from_bytes
from typing import List
from PIL import Image
from django.core.files.uploadedfile import UploadedFile
import io


class PdfConverter:

    def convert_pdf_to_images(self, pdf_file: UploadedFile) -> List[Image.Image]:
        """pdf의 각 페이지를 이미지로 변환.
        :param pdf_file: serializers.FileField로 받은 pdf파일을 바로 인자로 넣으면 된다.
        :type pdf_file: File
        :return: List[np.ndarray]
        """
        pdf_bytes = pdf_file.read()
        images = convert_from_bytes(pdf_bytes, fmt='jpeg') # OCR 인식이 잘 안되면 dpi=300으로 설정해볼것
        return images
    
    def pilImages_to_bytesImages(self, pil_list: List[Image.Image]) -> List:
        files_to_send = []
        for idx, image in enumerate(pil_list):
            image_bytes = io.BytesIO()
            image.save(image_bytes, format='JPEG')
            image_bytes.seek(0)

            filename = f'page_{idx+1}.jpg'

            files_to_send.append(
                ('files', (filename, image_bytes.getvalue(), 'image/jpeg'))
            )

        return files_to_send