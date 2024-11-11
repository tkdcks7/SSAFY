from typing import Dict, List
from django.core.files.uploadedfile import UploadedFile
import requests
from rest_framework import status
from rest_framework.response import Response
from . import LayoutAnalyze, InitialEbookConverter, OcrParallel, ImageToTextConverter
from ebooklib import epub
from asgiref.sync import async_to_sync
from ..services.image_captioner import ImageCaptioner

class Integration:
    def make_ebook(self, metadata: Dict, files: List[UploadedFile]) -> epub.EpubBook:
        # gpu 서버에 레이아웃 분석 요청 -> .npz 파일 수령
            files_to_send = [('files', (file.name, file.read(), file.content_type)) for file in files]

            response = requests.post(
                'http://localhost:5000/layout-analysis',
                files=files_to_send
            )

            if response.status_code != 200:
                return Response({'error': '이미지 레이아웃 분석 실패'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # .npz 파일 가공
            pages = LayoutAnalyze.load_and_check_npz(response.content)
            data = {'metadata': metadata, 'pages': pages}

            # ocr 변환
            # ocr_converter = ImageToTextConverter() # 배치/병렬처리 X
            ocr_converter = OcrParallel() # 배치/병렬처리 O
            ocr_processed_data = ocr_converter.process_book(input_data=data)

            # ebook 변환
            ebook_maker = InitialEbookConverter()
            new_book = ebook_maker.make_book(ocr_processed_data)

            # ------------------- 
            # 이미지 캡셔닝
            captioner = ImageCaptioner()
            # async to sync 이용하여 동기처리 
            captioned_book, metadata = async_to_sync(captioner.image_captioning)(captioned_book, ocr_processed_data.metadata)


            return captioned_book