from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.http import JsonResponse
from .services import Integration
import io
from asgiref.sync import async_to_sync
from config.settings.base import STATIC_ROOT
from .services import S3Client
import uuid

#----------- image captioning 
from .services.epub_reader import EpubReader 
from .services.image_captioner import ImageCaptioner
import json
from PIL import Image
import numpy as np
import datetime

#------- sse
from .services.sse import send_sse_message

#-------- member verification
from rest_framework import exceptions

## ----------------- correction
from main.services.punctuation_converter import PunctuationConverter

## 테스트용 API
def test_view(request):
    # member_id = get_member_id(request)
    # member = verify_member(request)
    # if member_id is None or member is None:
    #     return JsonResponse({"error": "멤버 인증 실패"}, status=status.HTTP_403_FORBIDDEN)
    
    member = request.member
    data = {
        "member_id": member.member_id,
        "verified": True,
        "member_info": member.name,
        "message": "hello world"
    }
    return JsonResponse(data) 


## 이미지 캡셔닝 테스트 
@method_decorator(csrf_exempt, name='dispatch')
class ImageCaptioningView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    # 테스트용. 지정된 path에서 파일을 가져온다. 
    def get(self, request):
        path = request.query_params.get('path')
        if not path:
            return Response({"error": "Path parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        epub = EpubReader.read_epub_from_local(path)
        if epub is None:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        
        captioner = ImageCaptioner()
        # async to sync 이용하여 동기처리 
        processed_images, metadata = async_to_sync(captioner.image_captioning)(epub, {})
        
        response_data = [
            # {
            #     "name": name,
            #     "caption": caption,
            # }
            # for name, caption, _ in processed_images
        ]
        
        return Response(metadata)


# 이미지 업로드시 ebook으로 변환하는 api
@method_decorator(csrf_exempt, name='dispatch')
class Image2BookConverter(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def post(self, request):
        MEMBER_ID = request.member.member_id
        channel = request.headers.get('X-Request-ID', 'default-channel')
        # 이미지 파일 받기 (커버 이미지, 페이지 이미지)
        files = request.FILES.getlist('uploadFile')
        cover = request.FILES.get('cover')

        if not files or not cover:
            return Response({'error: 파일 없음'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 메타데이터 받기 (작가명, 제목) + 메타데이터 추가 (커버 이미지, 생성일시)
        try:
            metadata = json.loads(request.POST.get('metadata', '{}'))
        except json.JSONDecodeError:
            return Response({'error': '잘못된 JSON 형식'}, status=status.HTTP_400_BAD_REQUEST)
        
        cover = np.array(Image.open(io.BytesIO(cover.read())))
        metadata['cover'] = cover
        metadata['dtype'] = 'REGISTERED'
        
        # ebook 만드는 프로세스
        filename = f'{uuid.uuid4()}.epub'
        book, metadata = Integration().image_to_ebook(metadata=metadata, files=files, file_name=filename, channel=channel)

        # ebook을 s3에 저장
        epub_data = S3Client().upload_epub_to_s3(book, filename, metadata, MEMBER_ID)
        
        # response 가공
        response_body = {
            'epub': epub_data['epub'],
            'metadata': metadata
        }

        return Response(response_body, status=status.HTTP_200_OK)
        


# pdf 업로드시 ebook으로 변환 후 반환
@method_decorator(csrf_exempt, name='dispatch')
class Pdf2BookConverter(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def post(self, request):
        MEMBER_ID = request.member.member_id
        channel = request.headers.get('X-Request-ID', 'default-channel')
        # 이미지 파일 받기 (커버 이미지, 페이지 이미지)
        file = request.FILES.get('uploadFile')
        cover = request.FILES.get('cover')

        if not file or not cover:
            return Response({'error: 파일 없음'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 메타데이터 받기 (작가명, 제목, 카테고리) + 메타데이터 추가 (커버 이미지, 생성일시)
        try:
            metadata = json.loads(request.POST.get('metadata', '{}'))
        except json.JSONDecodeError:
            return Response({'error': '잘못된 JSON 형식'}, status=status.HTTP_400_BAD_REQUEST)
        
        cover = np.array(Image.open(io.BytesIO(cover.read())))
        metadata['dtype'] = 'REGISTERED'
        metadata['cover'] = cover
        
        # ebook 만드는 프로세스
        filename = f'{datetime.datetime.now()}.epub'
        book, metadata = Integration().pdf_to_ebook(metadata=metadata, file=file, file_name=filename, channel=channel)

        # ebook을 s3에 저장
        epub_data = S3Client().upload_epub_to_s3(book, filename, metadata, MEMBER_ID)
        
        # response 가공
        response_body = {
            'epub': epub_data['epub'],
            'metadata': metadata
        }

        # 특별히 오류가 발생하지 않으면 성공으로 간주
        return Response(response_body, status=status.HTTP_200_OK)
        
        

# epub 업로드시 접근성 적용한 ebook으로 변환 후 반환
@method_decorator(csrf_exempt, name='dispatch')
class Epub2BookConverter(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def post(self, request):
        MEMBER_ID = request.member.member_id
        # 헤더에서 채널명 받기
        channel = request.headers.get('X-Request-ID', 'default-channel')

        # 이미지 파일 받기 (커버 이미지, 페이지 이미지)
        file = request.FILES.get('uploadFile')
        cover = request.FILES.get('cover')

        if not file or not cover:
            return Response({'error: 파일 없음'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 메타데이터 받기 (작가명, 제목) + 메타데이터 추가 (커버 이미지, 생성일시)
        try:
            metadata = json.loads(request.POST.get('metadata', '{}'))
        except json.JSONDecodeError:
            return Response({'error': '잘못된 JSON 형식'}, status=status.HTTP_400_BAD_REQUEST)
        
        cover = np.array(Image.open(io.BytesIO(cover.read())))
        metadata['dtype'] = 'REGISTERED'
        metadata['cover'] = cover
        
        # ebook 만드는 프로세스
        filename = f'{datetime.datetime.now()}.epub'
        book, metadata = Integration().epub_to_ebook(metadata=metadata, file=file, file_name=filename, channel=channel)

        # s3에 저장
        epub_data = S3Client().upload_epub_to_s3(book, filename, metadata, MEMBER_ID)
        
        # response 가공
        response_body = {
            'epub': epub_data['epub'],
            'metadata': metadata
        }

        # 특별히 오류가 발생하지 않으면 성공으로 간주
        return Response(response_body, status=status.HTTP_200_OK)

class TestExceptionView(APIView):
    def get(self, request):
        # 테스트할 예외 종류별로 파라미터 받기
        error_type = request.GET.get('error_type', '')
        
        if error_type == 'validation':
            raise exceptions.ValidationError('데이터 유효성 검증 실패')
            
        elif error_type == 'permission':
            raise exceptions.PermissionDenied('권한이 없습니다')
            
        elif error_type == 'not_found':
            raise exceptions.NotFound('리소스를 찾을 수 없습니다')
            
        elif error_type == 'server':
            # 일반 Python 예외 (500 에러 테스트)
            raise Exception('서버 내부 오류 테스트')
            
        return Response({'message': 'OK'})
        


## 띄어쓰기 교정 테스트 
@method_decorator(csrf_exempt, name='dispatch')
class CorrectionTest(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    # 테스트용. 지정된 path에서 파일을 가져온다. 
    def get(self, request):
        path = request.query_params.get('path')
        if not path:
            return Response({"error": "Path parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        epub = EpubReader.read_epub_from_local(path)
        if epub is None:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        
        corrected_book = PunctuationConverter.fix_punctuation(epub)
        EpubReader.write_epub_to_local("staticfiles/", "smile_corrected_book", corrected_book)
        
        return Response("go")