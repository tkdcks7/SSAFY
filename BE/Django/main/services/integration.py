from typing import Dict, List, Tuple
from django.core.files.uploadedfile import UploadedFile
import requests
from rest_framework import status
from rest_framework.response import Response
from . import LayoutAnalyze, InitialEbookConverter, OcrParallel, PdfConverter, EpubReader, MysqlUtil
from ebooklib import epub
from asgiref.sync import async_to_sync
from ..services.image_captioner import ImageCaptioner
from django.conf import settings
from .s3_storage import S3Client
import os
import tempfile
from .sse import send_sse_message
from .member_auth import get_member_id, verify_member

### ------------------------
from main.services.epub_accessibility_util import EpubAccessibilityConverter

class Integration:
    def __init__(self):
        self.member_id = 1 # 일단 static으로 설정

    def image_to_ebook(self, metadata: Dict, files: List[UploadedFile], file_name: str, channel: str) -> Tuple[epub.EpubBook, Dict]:
        # SSE 메세지 보내기
        send_sse_message(channel, '문서 레이아웃 분석중', 20)

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

        # SSE 메세지 보내기
        send_sse_message(channel, '텍스트 추출중', 40)

        # ocr 변환
        ocr_converter = OcrParallel() # 배치/병렬처리 O
        ocr_processed_data = ocr_converter.process_book(input_data=data)

        # SSE 메세지 보내기
        send_sse_message(channel, 'ebook 변환중', 60)

        # ebook 변환
        ebook_maker = InitialEbookConverter()
        new_book = ebook_maker.make_book(ocr_processed_data)

        # SSE 메세지 보내기
        send_sse_message(channel, '시각장애인을 위한 접근성 적용중', 80)

        # 이미지 캡셔닝
        captioner = ImageCaptioner()
        captioned_book, metadata = async_to_sync(captioner.image_captioning_for_integration)(new_book, ocr_processed_data['metadata'])

        # 커버 이미지 S3에 저장
        url = S3Client().save_numpy_to_s3(metadata['cover'], f'image/cover/{metadata['title']}_cover.jpg')
        metadata['cover'] = url

        # 접근성 적용
        epub_access = EpubAccessibilityConverter()
        epub_access.set_epub(captioned_book)
        epub_access.format_body()
        formatted_book = epub_access.get_epub()

        # ebook span태그에 index 붙이기
        indexed_book = EpubReader.set_sentence_index(formatted_book)

        # mysql에 정보 저장
        dbutil = MysqlUtil()
        saved_book = dbutil.save_book(
            member_id=self.member_id,
            category_id=metadata['category'],
            title=metadata['title'],
            cover_url=metadata['cover'],
            cover_alt=metadata['cover_alt'],
            author=metadata['author'],
            my_tts_flag=1,
            epub=file_name
        )
        metadata['book_id'] = saved_book.book_id
        metadata['created_at'] = saved_book.created_at

        # SSE 메세지 보내기
        send_sse_message(channel, '완료', 100)

        return (indexed_book, metadata)
    
    
    def pdf_to_ebook(self, metadata: Dict, file: UploadedFile, file_name: str, channel: str) -> Tuple[epub.EpubBook, Dict]:
        # SSE 메세지 보내기
        send_sse_message(channel, 'pdf를 이미지로 변환중', 20)
        
        # pdf -> image list
        images = PdfConverter().convert_pdf_to_images(file)

        # image list를 http 파일로 보낼 준비
        files_to_send = PdfConverter().pilImages_to_bytesImages(images)

        # SSE 메세지 보내기
        send_sse_message(channel, '문서 레이아웃 분석중', 40)

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

        # SSE 메세지 보내기
        send_sse_message(channel, '텍스트 추출중', 60)

        # ocr 변환
        ocr_converter = OcrParallel() # 배치/병렬처리 O
        ocr_processed_data = ocr_converter.process_book(input_data=data)

        # SSE 메세지 보내기
        send_sse_message(channel, 'ebook으로 변환중', 80)

        # ebook 변환
        ebook_maker = InitialEbookConverter()
        new_book = ebook_maker.make_book(ocr_processed_data)

        # SSE 메세지 보내기
        send_sse_message(channel, '시각장애인을 위한 접근성 적용중', 90)

        # 이미지 캡셔닝
        captioner = ImageCaptioner()
        captioned_book, metadata = async_to_sync(captioner.image_captioning_for_integration)(new_book, ocr_processed_data['metadata'])

        # 커버 이미지 S3에 저장
        url = S3Client().save_numpy_to_s3(metadata['cover'], f'image/cover/{metadata['title']}_cover.jpg')
        metadata['cover'] = url

        # 접근성 적용

        # ebook span태그에 index 붙이기
        indexed_book = EpubReader.set_sentence_index(captioned_book)

        # mysql에 정보 저장
        dbutil = MysqlUtil()
        saved_book = dbutil.save_book(
            member_id=self.member_id,
            category_id=metadata['category'],
            title=metadata['title'],
            cover_url=metadata['cover'],
            cover_alt=metadata['cover_alt'],
            author=metadata['author'],
            my_tts_flag=1,
            epub=file_name
        )
        metadata['book_id'] = saved_book.book_id
        metadata['created_at'] = saved_book.created_at

        # SSE 메세지 보내기
        send_sse_message(channel, '완료', 100)

        return (indexed_book, metadata)    
    

    def epub_to_ebook(self, metadata: Dict, file: UploadedFile, file_name: str, channel: int) -> Tuple[epub.EpubBook, Dict]:
        # epub 임시파일 생성
        with tempfile.NamedTemporaryFile(delete=False, suffix='.epub') as temp_file:
            # delete = False 이유: true로 설정하면 with 블록 안에서(파일이 열린 상태에서) read_epub()에서 임시 파일을 읽으려 시도할 때 windows에서 접근 거부 오류 발생
            # 리눅스나 맥OS에서는 이런 문제가 없지만 windows에서는 오류 발생..
            try:
                # 업로드된 파일 내용을 임시 파일에 쓰기
                for chunk in file.chunks():
                    temp_file.write(chunk)
                temp_file.flush()

                # SSE 메세지 보내기
                send_sse_message(channel, 'Ebook에 접근성 적용중', 40)

                # epub 파일 읽기
                book = epub.read_epub(temp_file.name)        

                # 이미지 캡셔닝
                processed_book, metadata = async_to_sync(ImageCaptioner().image_captioning)(book, metadata)

                # 커버 이미지 S3에 저장
                url = S3Client().save_numpy_to_s3(metadata['cover'], f'image/cover/{metadata['title']}_cover.jpg')
                metadata['cover'] = url

                # 접근성 적용

                # ebook span태그에 index 붙이기
                indexed_book = EpubReader.set_sentence_index(processed_book)

                # mysql에 정보 저장
                dbutil = MysqlUtil()
                saved_book = dbutil.save_book(
                    member_id=self.member_id,
                    category_id=metadata['category'],
                    title=metadata['title'],
                    cover_url=metadata['cover'],
                    cover_alt=metadata['cover_alt'],
                    author=metadata['author'],
                    my_tts_flag=1,
                    epub=file_name
                )
                metadata['book_id'] = saved_book.book_id
                metadata['created_at'] = saved_book.created_at

                # SSE 메세지 보내기
                send_sse_message(channel, '거의 완료되었어요', 100)

                return (indexed_book, metadata)
            
            finally:
                # 임시 파일 삭제
                try:
                    os.unlink(temp_file.name)
                except Exception:
                    pass