from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from .serializers import ImageLayouts
from .serializers import TextImages
from .services import ImageToTextConverter
from django.http import JsonResponse
from django.http import QueryDict

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