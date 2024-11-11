from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.http import JsonResponse, FileResponse

from .services.dbConnector import MysqlConnector, MongoDBConnector


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