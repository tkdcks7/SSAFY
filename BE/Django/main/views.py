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

#----------- image captioning 
from .services.epub_reader import EpubReader 
from .services.image_captioner import ImageCaptioner
import json
from PIL import Image
import numpy as np
import datetime

# Create your views here.

## 테스트용 API
def test_view(request):
    return JsonResponse({"message": "hello world"}) 


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
        processed_images = async_to_sync(captioner.image_captioning)(epub)
        
        response_data = [
            # {
            #     "name": name,
            #     "caption": caption,
            # }
            # for name, caption, _ in processed_images
        ]
        
        return Response(response_data)


# 이미지 업로드시 ebook으로 변환하는 api
@method_decorator(csrf_exempt, name='dispatch')
class Image2BookConverter(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def post(self, request):
        try:
            # 이미지 파일 받기 (커버 이미지, 페이지 이미지)
            files = request.FILES.getlist('images')
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
            metadata['created_at'] = datetime.datetime.now()
            
            # ebook 만드는 프로세스
            book = Integration().make_ebook(metadata=metadata, files=files)

            # s3에 저장
            filename = f'{datetime.datetime.now()}.epub'
            epub_data = S3Client().upload_epub_to_s3(book, filename, metadata)
            
            # response 가공
            response_body = {
                '결과': 'ebook 생성 성공',
                'epub_link': epub_data['epub']
            }

            # 특별히 오류가 발생하지 않으면 성공으로 간주
            return Response(response_body, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
