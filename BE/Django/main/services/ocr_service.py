import requests
from config.settings import base
from datetime import datetime
from typing import Dict, List
import uuid

class NaverOcrClient:
    def __init__(self):
        self.invoke_url = base.NAVER_OCR_INVOKE_URL
        self.secret_key = base.NAVER_OCR_SECRET_KEY
    
    def process_image(self, image_data: str, image_name: str) -> Dict:
        """
        이미지를 네이버 OCR API로 전송하고 결과를 받아옴.
        일단은 이미지 한장만 처리하는 방식으로 구현
        image_data: Base64로 인코딩된 이미지
        image_name: "pageNumber_sectionNumber"
        """
        headers = {
            'X-OCR-SECRET': self.secret_key,
            'Content-Type': 'application/json'
        }

        request_json = {
            'version': 'V2',
            'requestId': str(uuid.uuid4()),
            'timestamp': int(datetime.now().timestamp()),
            'lang': 'ko',
            'images': [
                {
                    'format': 'jpg',
                    'name': image_name, # 이미지 식별 및 응답 결과 확인 시 사용
                    'data': image_data # base64 인코딩된 이미지 데이터
                }
            ], # images array 보낼 수 있음
            'enableTableDetection': False
        }

        response = requests.post(
            url=self.invoke_url,
            headers=headers,
            json=request_json
        )
        
        if response.status_code != 200:
            print("OCR 정상 응답 X")
            return {}

        return response.json()

