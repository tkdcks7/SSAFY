from typing import Dict, List, Tuple
from django.core.files.uploadedfile import UploadedFile
import requests
from rest_framework import status
from rest_framework.response import Response
from . import LayoutAnalyze, InitialEbookConverter, OcrParallel, PdfConverter
from ebooklib import epub
from asgiref.sync import async_to_sync
from ..services.image_captioner import ImageCaptioner
from django.conf import settings
from .s3_storage import S3Client
import os
import tempfile

class Integration:
    def image_to_ebook(self, metadata: Dict, files: List[UploadedFile]) -> Tuple[epub.EpubBook, Dict]:
        # gpu 서버에 레이아웃 분석 요청 -> .npz 파일 수령
        files_to_send = [('files', (file.name, file.read(), file.content_type)) for file in files]

        response = requests.post(
            settings.FASTAPI_URL+"/layout-analysis",
            files=files_to_send
        )

        if response.status_code != 200:
            return Response({'error': '이미지 레이아웃 분석 실패'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # .npz 파일 가공
        pages = LayoutAnalyze.load_and_check_npz(response.content)
        data = {'metadata': metadata, 'pages': pages}

        # ocr 변환
        ocr_converter = OcrParallel() # 배치/병렬처리 O
        ocr_processed_data = ocr_converter.process_book(input_data=data)

        # ebook 변환
        ebook_maker = InitialEbookConverter()
        new_book = ebook_maker.make_book(ocr_processed_data)

        # 이미지 캡셔닝
        captioner = ImageCaptioner()
        captioned_book, metadata = async_to_sync(captioner.image_captioning_for_integration)(new_book, ocr_processed_data['metadata'])

        # 커버 이미지 S3에 저장
        url = S3Client().save_numpy_to_s3(metadata['cover'], f'image/cover/{metadata['title']}_cover.jpg')
        metadata['cover'] = url

        # 접근성 적용

        # ebook span태그에 index 붙이기

        # mysql에 정보 저장

        return (captioned_book, metadata)
    
    
    def pdf_to_ebook(self, metadata: Dict, file: UploadedFile) -> Tuple[epub.EpubBook, Dict]:
        # pdf -> image list
        images = PdfConverter().convert_pdf_to_images(file)

        # image list를 http 파일로 보낼 준비
        files_to_send = PdfConverter().pilImages_to_bytesImages(images)

        # gpu 서버에 레이아웃 분석 요청 -> .npz 파일 수령
        response = requests.post(
            settings.FASTAPI_URL+"/layout-analysis",
            files=files_to_send
        )

        if response.status_code != 200:
            return Response({'error': '이미지 레이아웃 분석 실패'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # .npz 파일 가공
        pages = LayoutAnalyze.load_and_check_npz(response.content)
        data = {'metadata': metadata, 'pages': pages}

        # ocr 변환
        ocr_converter = OcrParallel() # 배치/병렬처리 O
        ocr_processed_data = ocr_converter.process_book(input_data=data)

        # ebook 변환
        ebook_maker = InitialEbookConverter()
        new_book = ebook_maker.make_book(ocr_processed_data)

        # 이미지 캡셔닝
        captioner = ImageCaptioner()
        captioned_book, metadata = async_to_sync(captioner.image_captioning_for_integration)(new_book, ocr_processed_data['metadata'])

        # 커버 이미지 S3에 저장
        url = S3Client().save_numpy_to_s3(metadata['cover'], f'image/cover/{metadata['title']}_cover.jpg')
        metadata['cover'] = url

        # 접근성 적용

        # ebook span태그에 index 붙이기

        # mysql에 정보 저장

        return (captioned_book, metadata)    
    

    def epub_to_ebook(self, metadata: Dict, file: UploadedFile) -> Tuple[epub.EpubBook, Dict]:
        # epub 임시파일 생성
        with tempfile.NamedTemporaryFile(delete=False, suffix='.epub') as temp_file:
            # delete = False 이유: true로 설정하면 with 블록 안에서(파일이 열린 상태에서) read_epub()에서 임시 파일을 읽으려 시도할 때 windows에서 접근 거부 오류 발생
            # 리눅스나 맥OS에서는 이런 문제가 없지만 windows에서는 오류 발생..
            try:
                # 업로드된 파일 내용을 임시 파일에 쓰기
                for chunk in file.chunks():
                    temp_file.write(chunk)
                temp_file.flush()

                # epub 파일 읽기
                book = epub.read_epub(temp_file.name)        

                # 이미지 캡셔닝
                processed_book, metadata = async_to_sync(ImageCaptioner().image_captioning)(book, metadata)

                # 커버 이미지 S3에 저장
                url = S3Client().save_numpy_to_s3(metadata['cover'], f'image/cover/{metadata['title']}_cover.jpg')
                metadata['cover'] = url

                # 접근성 적용

                # ebook span태그에 index 붙이기

                # mysql에 정보 저장

                return (processed_book, metadata)
            
            finally:
                # 임시 파일 삭제
                try:
                    os.unlink(temp_file.name)
                except Exception:
                    pass