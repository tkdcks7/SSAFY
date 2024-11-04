from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from .serializers import ImageLayouts, Pdf
from .services import ImageToTextConverter
from django.http import JsonResponse
from .services import PdfConverter
import io
import base64

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
