from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from .serializers import ImageLayouts, Pdf
from .services import ImageToTextConverter
from django.http import JsonResponse, FileResponse
from .services import PdfConverter
from .services import LayoutAnalyze
import io
import base64
import requests

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

# metadata와 이미지들을 첨부해서 요청 -> fastapi에서 레이아웃 분석 -> 다시 장고로 npz파일 보냄 -> 일단 클라이언트로 .npz파일 전송 
# 위 계획 성공시 장고에서 npz파일 복원 -> 이미지 콘솔창에 프린트
@method_decorator(csrf_exempt, name='dispatch')
class LayoutAnalyzeTestView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def post(self, request):
        try:
            files = request.FILES.getlist('images')

            if not files:
                return Response({'error: 파일 없음'}, status=status.HTTP_400_BAD_REQUEST)
            
            files_to_send = [('files', (file.name, file.read(), file.content_type)) for file in files]

            response = requests.post(
                'http://localhost:5000/layout-analysis',
                files=files_to_send
            )

            if response.status_code != 200:
                return Response({'error': '이미지 레이아웃 분석 실패'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # .npz 파일 분석 및 이미지 출력
            metadata = LayoutAnalyze.load_and_check_npz(response.content)
            # print(metadata)

            # 클라이언트로 .npz파일을 전송하기 위해..
            file_obj = io.BytesIO(response.content)
            return FileResponse(
                file_obj,
                content_type='application/octet-stream',
                as_attachment=True,
                filename='result.npz'
            )
        
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
