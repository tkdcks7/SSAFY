from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.http import JsonResponse, FileResponse


## 테스트용 API
def test_view(request):
    return JsonResponse({"message": "hello world"}) 
