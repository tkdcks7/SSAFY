from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from .serializers import ImageLayouts, Pdf
from .services import ImageToTextConverter
from django.http import JsonResponse, FileResponse
from .services import PdfConverter, LayoutAnalyze, ImageToTextConverter, InitialEbookConverter, Integration
import io
import os
import base64
from asgiref.sync import async_to_sync
from config.settings.base import STATIC_ROOT
from ebooklib import epub

#----------- image captioning 
from .services.epub_reader import EpubReader 
from .services.image_captioner import ImageCaptioner
import json
from PIL import Image
import numpy as np
import datetime

# Create your views here.

@method_decorator(csrf_exempt, name='dispatch')
class OcrProcessingView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def post(self, request):
        try:
            images_layouts = ImageLayouts(data=request.data)
            print(images_layouts)
            if not images_layouts.is_valid():
                return Response(images_layouts.errors, status=status.HTTP_400_BAD_REQUEST)
            
            processor = ImageToTextConverter()
            result = processor.process_book(images_layouts)
            return JsonResponse(result)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# pdf 변환 실험용 api -> 로컬에서 성공
@method_decorator(csrf_exempt, name='dispatch')
class PdfProcessingView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def post(self, request):
        pdf_file = Pdf(data=request.data)
        if not pdf_file.is_valid():
                return Response(pdf_file.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            images = PdfConverter.convert_pdf_to_images(pdf_file.validated_data['pdf'])

            # base64로 인코딩해 반환
            encoded_images = []
            for image in images:
                buffered = io.BytesIO()
                image.save(buffered, format='JPEG')
                image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
                encoded_images.append(image_base64)

            return Response({
                "images": encoded_images
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


### ------------------------

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
        processed_images, metadata = async_to_sync(captioner.image_captioning)(epub, {})
        
        response_data = [
            # {
            #     "name": name,
            #     "caption": caption,
            # }
            # for name, caption, _ in processed_images
        ]
        
        return Response(metadata)


# metadata와 이미지들을 첨부해서 요청 -> fastapi에서 레이아웃 분석 -> 다시 장고로 npz파일 보냄 -> ocr 요청 -> ebook 제작
# 클라이언트에게 metadata와 ebook 주소 보냄
@method_decorator(csrf_exempt, name='dispatch')
class LayoutAnalyzeTestView(APIView):
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

            # staticfiles에 저장
            epub.write_epub(os.path.join(STATIC_ROOT, 'example.epub'), book)

            # 특별히 오류가 발생하지 않으면 성공으로 간주
            return Response({'결과': 'ebook 생성 성공'}, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
