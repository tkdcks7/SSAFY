# 컨트롤러와 path 연결해주는 파일같음

from django.urls import path

from . import views
from .views import RecommendationFamous, RecommendationDemographics, RecommendationCategory, RecommendationSimilarLikesBook, RecommendationSimilarMemberBook, BookStoryAnalzer


urlpatterns = [
    path('test', views.test_view, name='test'),
    path('test-mysql', views.test_mysql),
    path('test-mongo', views.test_mongo),
    ## --------------------------
    ## 추천 로직
    ## --------------------------
    path('rec-famous', RecommendationFamous.as_view()),
    path('rec-demo', RecommendationDemographics.as_view()),
    path('rec-cate', RecommendationCategory.as_view()),
    path('rec-slb', RecommendationSimilarLikesBook.as_view()),
    path('rec-smb', RecommendationSimilarMemberBook.as_view()),
    ## ---- 이외 유틸 ------------
    path('util-story', BookStoryAnalzer.as_view()),

]