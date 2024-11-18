from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from django.http import JsonResponse
import logging
from typing import Set

class APIAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # 인증이 필요 없는 경로들
        self.public_paths: Set[str] = {
            # '/api/registration/test',
            '/api/registration/image-caption/',
            '/api/registration/error-test'
            # 필요한 public endpoint 추가
        }

    def __call__(self, request):
        print("사용자 인증 미들웨어 진입")
        if not self._is_public_path(request.path) and request.path.startswith('/api/'):
            from .services.member_auth import verify_member # circular import 방지

            member = verify_member(request)
            if member is None:
                data = {
                    "code": "M005",
                    "message": "페이지에 접근할 수 있는 권한이 없음"
                }
                return JsonResponse(data, status=403, json_dumps_params={'ensure_ascii': False})
            
            # 인증된 사용자 정보를 request에 저장
            request.member = member

        response = self.get_response(request)

        # CORS 헤더 추가 (필요한가..?)
        # response["Access-Control-Allow-Origin"] = "*"
        # response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

        return response
    
    def _is_public_path(self, path: str) -> bool:
        """인증이 필요없는 public path인지 확인"""
        return any(
            path.startswith(public_path)
            for public_path in self.public_paths
        )

def custom_exception_handler(exc, context):
    """DRF 예외 핸들러"""
    response = exception_handler(exc, context)

    if response is not None:
        data = {
            "code": "X001",
            "message": "서버 오류"
        }
        response.data = data

    return response

class ExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            return self.handle_exception(e)

    def handle_exception(self, exc):
        """
        Exception 터지면 500 Internal Server Error 반환
        """
        data = {
            "code": "X001",
            "message": "서버 오류"
        }
        return JsonResponse(data, status=500, json_dumps_params={'ensure_ascii': False})