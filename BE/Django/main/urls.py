# 컨트롤러와 path 연결해주는 파일같음

from django.urls import path, include
import django_eventstream

from .views import ImageCaptioningView, Image2BookConverter, Pdf2BookConverter, Epub2BookConverter, TestExceptionView
from . import views 

urlpatterns = [
    path('test', views.test_view, name='test'),
    path('image-caption/', ImageCaptioningView.as_view(), name='image_captioning'),
    path('upload/image', Image2BookConverter.as_view(), name='image2ebook'),
    path('upload/pdf', Pdf2BookConverter.as_view(), name='pdf2ebook'),
    path('upload/epub', Epub2BookConverter.as_view(), name='epub2ebook'),
    path('events/<channel>', include(django_eventstream.urls)), # SSE 연결 요청
    path('error-test', TestExceptionView.as_view(), name='test_exception_view')
]