import logging
import boto3
from botocore.exceptions import ClientError
from config.settings.base import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_BUCKET, AWS_REGION
from ebooklib import epub
import io 
from datetime import datetime
import numpy as np
from PIL import Image
from urllib.parse import quote

class S3Client:

    def upload_fileobj(self, file_object, s3_key):
        """
        S3 버켓에 파일 객체(바이너리) 업로드. 
        file_object: 업로드할 파일 객체
        bucket: 버킷 이름
        s3_key: S3에 저장할 경로 (파일명까지 포함)
        return: boolean
        """
        client = boto3.client(  # 정확한 타입 힌트 추가
            's3',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION
        )

        try:
            response = client.upload_fileobj(file_object, AWS_S3_BUCKET, s3_key)
            logging.info(response)
        except ClientError as e:
            logging.error(e)
            return False
        return True
    
    def generate_download_url(self, s3_key, expiration=3600):
        """
        다운로드(presigned) URL 생성
        s3_key: 다운로드할 파일의 키 (경로)
        expiration: URL 유효 시간 (초단위, 기본값 3600초)
        return: 다운로드 url
        """
        client = boto3.client(  # 정확한 타입 힌트 추가
            's3',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION
        )
        try:
            url = client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': AWS_S3_BUCKET,
                    'Key': s3_key
                },
                ExpiresIn=expiration
            )
            return url
        except Exception as e:
            logging.error(e)
            return None
    
    def upload_epub_to_s3(self, book: epub, filename: str, metadata: object):
        buffer = io.BytesIO()
        try:
            epub.write_epub(buffer, book) # 버퍼에 epub 저장
            buffer.seek(0)
            s3_key = f'epub/registered/{filename}' # S3 내 저장 경로
            self.upload_fileobj(file_object=buffer, s3_key=s3_key) # 파일 업로드
            download_url = self.generate_download_url(s3_key=s3_key) # 다운로드 링크 생성

            return {
                "epub": download_url,
                "dtype": "REGISTERED",
                "metadata": {
                    "title": metadata.get('title', '(제목 미정)'),
                    "author": metadata.get('author', '(작자 미상)'),
                    "created_at": metadata.get('created_at', datetime.now().isoformat()),
                    "cover": metadata.get('cover') #s3 링크로 바꿔야 함..?
                }
            }
        except Exception as e:
            print(f'EPUB 파일 생성 중 에러 발생: {str(e)}')
            return None
        
    def save_numpy_to_s3(self, array: np.ndarray, s3_key: str) -> str:
        """이미지를 jpg로 저장하고 url 반환"""
        client = boto3.client(  # 정확한 타입 힌트 추가
            's3',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION
        )

        pil_cover = Image.fromarray(array)
        buffer = io.BytesIO()
        pil_cover.save(buffer, format='JPEG')
        buffer.seek(0)

        extra_args = {
            'ContentType': 'image/jpeg',
            'ContentDisposition': 'inline'
        }

        client.upload_fileobj(buffer, AWS_S3_BUCKET, s3_key, ExtraArgs=extra_args)

        url = f'https://{AWS_S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{quote(s3_key)}'
        return url
