# 컨트롤러와 path 연결해주는 파일같음

from django.urls import path

from . import views 

urlpatterns = [
    path('test', views.test_view, name='test'),
    path('test-mysql', views.test_mysql),
    path('test-mongo', views.test_mongo)
]