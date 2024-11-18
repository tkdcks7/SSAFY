from .base import *

ALLOWED_HOSTS = ['audisay.kr', 'www.audisay.kr']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('MYSQL_SCHEMA_NAME'), # db 이름
        'USER': env('MYSQL_ROOT_USERNAME'), # 유저 이름
        'PASSWORD': env('MYSQL_ROOT_PASSWORD'),
        'HOST': env('MYSQL_BINDING_HOST'), # host 이름
        'PORT': env('MYSQL_SERVER_PORT')
    }
}

# fastapi url
FASTAPI_URL = env('FASTAPI_URL')

# mongoDB 
DATABASE_MONGO = env('MONGO_DB_URI')

# redis 설정
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{env('REDIS_HOST')}:{env('REDIS_SERVER_PORT')}/0",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PASSWORD": env('REDIS_PASSWORD')
        }
    }
}