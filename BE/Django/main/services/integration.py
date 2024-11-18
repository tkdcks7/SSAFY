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
import time
import logging 

### ------------------------
from main.services.epub_accessibility_util import EpubAccessibilityConverter
from main.services.punctuation_converter import PunctuationConverter

class Integration:
    def __init__(self):
        self.member_id = 1 # 일단 static으로 설정

    def image_to_ebook(self, metadata: Dict, files: List[UploadedFile], file_name: str, channel: str) -> Tuple[epub.EpubBook, Dict]:

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
        send_sse_message(channel, f'레이아웃 분석 완료', 15)

        # ocr 변환
        ocr_converter = OcrParallel() # 배치/병렬처리 O
        ocr_processed_data = ocr_converter.process_book(input_data=data)
        
        # SSE 메세지 보내기
        send_sse_message(channel, f'글자 추출 완료', 40)


        # 띄어쓰기 교정 
        corrected_data = async_to_sync(PunctuationConverter.fix_punctuation_by_list)(ocr_processed_data)
        # SSE 메세지 보내기
        send_sse_message(channel, f'띄어쓰기 교정 완료', 55)

        

        # ebook 변환
        ebook_maker = InitialEbookConverter()
        new_book = ebook_maker.make_book(corrected_data)

        # SSE 메세지 보내기
        send_sse_message(channel, f'ebook 변환 완료', 60)

        # 이미지 캡셔닝
        captioner = ImageCaptioner()
        captioned_book, metadata = async_to_sync(captioner.image_captioning_for_integration)(new_book, ocr_processed_data['metadata'])
        send_sse_message(channel, f'이미지 주석 달기 완료', 75)

        # 커버 이미지 S3에 저장
        url = S3Client().save_numpy_to_s3(metadata['cover'], f'image/cover/{metadata['title']}_cover.jpg')
        metadata['cover'] = url

        # 접근성 적용
        epub_access = EpubAccessibilityConverter()
        formatted_book = epub_access.apply_accessibility_for_integration(captioned_book)
        send_sse_message(channel, f'접근성 적용 완료', 95)

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
        category = dbutil.getCategory(metadata['category'])
        metadata['category'] = category.category_name
        metadata['book_id'] = saved_book.book_id
        metadata['created_at'] = saved_book.created_at

        # SSE 메세지 보내기
        send_sse_message(channel, '완료', 100)

        return (indexed_book, metadata)
    
    
    def pdf_to_ebook(self, metadata: Dict, file: UploadedFile, file_name: str, channel: str) -> Tuple[epub.EpubBook, Dict]:
        
        # pdf -> image list
        images = PdfConverter().convert_pdf_to_images(file)

        # image list를 http 파일로 보낼 준비
        files_to_send = PdfConverter().pilImages_to_bytesImages(images)

        # SSE 메세지 보내기
        send_sse_message(channel, 'pdf를 이미지로 변환 완료', 20)

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
        send_sse_message(channel, '이미지 레이아웃 분석 완료', 40)

        # ocr 변환
        ocr_converter = OcrParallel() # 배치/병렬처리 O
        ocr_processed_data = ocr_converter.process_book(input_data=data)

        # SSE 메세지 보내기
        send_sse_message(channel, '글자 추출 완료', 60)

        # ebook 변환
        ebook_maker = InitialEbookConverter()
        new_book = ebook_maker.make_book(ocr_processed_data)

        # SSE 메세지 보내기
        send_sse_message(channel, 'ebook 변환 완료', 70)

        # 이미지 캡셔닝
        captioner = ImageCaptioner()
        captioned_book, metadata = async_to_sync(captioner.image_captioning_for_integration)(new_book, ocr_processed_data['metadata'])
        # SSE 메세지 보내기
        send_sse_message(channel, '이미지 주석 달기 완료', 75)

        # 커버 이미지 S3에 저장
        url = S3Client().save_numpy_to_s3(metadata['cover'], f'image/cover/{metadata['title']}_cover.jpg')
        metadata['cover'] = url

        # 접근성 적용
        epub_access = EpubAccessibilityConverter()
        formatted_book = epub_access.apply_accessibility_for_integration(captioned_book)
        # SSE 메세지 보내기
        send_sse_message(channel, '접근성 적용 완료', 80)

        # ebook span태그에 index 붙이기
        indexed_book = EpubReader.set_sentence_index(formatted_book)

        # 띄어쓰기 교정 
        corrected_book = PunctuationConverter.fix_punctuation(indexed_book)
        # SSE 메세지 보내기
        send_sse_message(channel, '띄어쓰기 교정 완료', 95)

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
        category = dbutil.getCategory(metadata['category'])
        metadata['category'] = category.category_name
        metadata['book_id'] = saved_book.book_id
        metadata['created_at'] = saved_book.created_at

        # SSE 메세지 보내기
        send_sse_message(channel, '완료', 100)

        return (corrected_book, metadata)    
    

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

                # epub 파일 읽기
                book = epub.read_epub(temp_file.name)        

                # 이미지 캡셔닝
                captioned_book, metadata = async_to_sync(ImageCaptioner().image_captioning)(book, metadata)
                # SSE 메세지 보내기
                send_sse_message(channel, '이미지에 주석 달기 완료', 30)

                # 커버 이미지 S3에 저장
                url = S3Client().save_numpy_to_s3(metadata['cover'], f'image/cover/{metadata['title']}_cover.jpg')
                metadata['cover'] = url

                # 접근성 적용
                epub_access = EpubAccessibilityConverter()
                formatted_book = epub_access.apply_accessibility(captioned_book)
                # SSE 메세지 보내기
                send_sse_message(channel, '접근성 적용 완료', 50)

                # ebook span태그에 index 붙이기
                indexed_book = EpubReader.set_sentence_index(formatted_book)

                # 띄어쓰기 교정 
                corrected_book = PunctuationConverter.fix_punctuation(indexed_book)
                # SSE 메세지 보내기
                send_sse_message(channel, '띄어쓰기 교정 완료', 90)

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
                category = dbutil.getCategory(metadata['category'])
                metadata['category'] = category.category_name
                metadata['book_id'] = saved_book.book_id
                metadata['created_at'] = saved_book.created_at

                # SSE 메세지 보내기
                send_sse_message(channel, '완료', 100)

                return (corrected_book, metadata)
            
            finally:
                # 임시 파일 삭제
                try:
                    os.unlink(temp_file.name)
                except Exception:
                    pass