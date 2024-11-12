from .base import *

ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('MYSQL_SCHEMA_NAME'), # db 이름
        'USER': env('MYSQL_ROOT_USERNAME'), # 유저 이름
        'PASSWORD': env('MYSQL_ROOT_PASSWORD'),
        'HOST': 'audisay.kr', # host 이름 k11d208.p.ssafy.io
        'PORT': '36284',
        'OPTIONS' : {
            'ssl' : False
        }
    }
}

# fastapi url
FASTAPI_URL = "http://localhost:5000"

DATABASE_MONGO = env('MONGO_DB_URI')