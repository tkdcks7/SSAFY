from .base import *

ALLOWED_HOSTS = ['43.203.204.37']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('MYSQL_SCHEMA_NAME'), # db 이름
        'USER': env('MYSQL_ROOT_USERNAME'), # 유저 이름
        'PASSWORD': env('MYSQL_ROOT_PASSWORD'),
        'HOST': env('MYSQL_BINDING_HOST'), # host 이름
        'PORT': env('MYSQL_SERVER_PORT'),
        'OPTIONS' : {
            'ssl' : False
        }
    }
}