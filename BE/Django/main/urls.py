# 컨트롤러와 path 연결해주는 파일같음

from django.urls import path

from .views import ImageCaptioningView, Image2BookConverter
from . import views 

urlpatterns = [
    path('test', views.test_view, name='test'),
    path('image-caption/', ImageCaptioningView.as_view(), name='image_captioning'),
    path('upload/image', Image2BookConverter.as_view(), name='image2ebook')
]