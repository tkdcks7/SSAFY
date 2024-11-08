from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from .serializers import ImageLayouts, Pdf
from .services import ImageToTextConverter
from django.http import JsonResponse, FileResponse
from .services import PdfConverter, LayoutAnalyze, ImageToTextConverter, InitialEbookConverter
import io
import base64
import requests
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
            ocr_converter = ImageToTextConverter()
            ocr_processed_data = ocr_converter.process_book(input_data=data)

            # ebook 변환: 생성된 ebook은 s3에 저장
            ebook_maker = InitialEbookConverter()
            final_data = ebook_maker.make_book(ocr_processed_data)

            # 임시반환값: cover 이미지가 numpy array형태로 반환됨
            return Response(final_data)
        
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
