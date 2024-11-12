from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.http import JsonResponse, FileResponse

from .services.dbutil import MysqlConnector, MongoDBConnector
from .services.recommendation_simple import FamousBookRecommendation, DemographicsBookRecommendation, CategoryBookRecommendation
from .services.recommendation_filtering import SimilarLikesBookRecommendation, SimilarMemberRecommendation

## 테스트용 API
def test_view(request):
    return JsonResponse({"message": "hello world"}) 

def test_mysql(request):
    connection = MysqlConnector.mysql_connect()
    data = MysqlConnector.mysql_read_all(connection, "SELECT * FROM member limit 1")
    return JsonResponse(data, safe=False)  


def test_mongo(request):
    client = MongoDBConnector.mongo_connect()
    collection = MongoDBConnector.mongo_get_collection(client, "recommendations", "long")
    query = {} 
    data = MongoDBConnector.read_data_from_collection(collection, query)
    print(data)
    return None


## 추천 로직 실행

@method_decorator(csrf_exempt, name='dispatch')
class RecommendationFamous(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def get(self, request):
        rec = FamousBookRecommendation()
        result = rec.get_recommendation() 
        result["_id"] = str(result["_id"])
        return JsonResponse(result)
    
@method_decorator(csrf_exempt, name='dispatch')
class RecommendationDemographics(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def get(self, request):
        rec = DemographicsBookRecommendation()
        result = rec.get_recommendation() 
        for item in result:
            item["_id"] = str(item["_id"])
        return JsonResponse(result, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class RecommendationCategory(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def get(self, request):
        rec = CategoryBookRecommendation()
        result = rec.get_recommendation() 
        for item in result:
            item["_id"] = str(item["_id"])
        return JsonResponse(result, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class RecommendationSimilarLikesBook(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def get(self, request):
        rec = SimilarLikesBookRecommendation()
        result = rec.get_recommendation() 
        for item in result:
            item["_id"] = str(item["_id"])
        return JsonResponse(result, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class RecommendationSimilarMemberBook(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def get(self, request):
        rec = SimilarMemberRecommendation()
        result = rec.get_recommendation() 
        for item in result:
            item["_id"] = str(item["_id"])
        return JsonResponse(result, safe=False)