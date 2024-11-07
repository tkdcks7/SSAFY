import os
from config.settings import base
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.aio import ImageAnalysisClient as AsyncImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential

class AzureImageAnalysis:
    def __init__(self):
        self.end_point = base.AZURE_VISION_ENDPOINT
        self.secret_key = base.AZURE_VISION_KEY
        self.region = base.AZURE_VISION_REGION

        # 생성될 때 연결
        self.get_async_client()
    
    def get_sync_client(self):
        # Image analysis client 생성 (동기)
        self.sync_client = ImageAnalysisClient(
            endpoint=self.end_point,
            credential=AzureKeyCredential(self.secret_key)
        )
    
    def get_async_client(self):
        self.async_client = AsyncImageAnalysisClient(
            endpoint=self.end_point,
            credential=AzureKeyCredential(self.secret_key)
        )

    def analyze_image_sync(self, image):
        result = self.sync_client.analyze(
            image_data=image,
            visual_features=[VisualFeatures.CAPTION]
        )
        
        if result.caption is not None:
            print(f"   '{result.caption.text}', Confidence {result.caption.confidence:.4f}")

        return result
    
    async def analyze_image_async(self, image):
        result = await self.async_client.analyze(
            image_data=image,
            visual_features=[VisualFeatures.CAPTION]
        )
        
        if result.caption is not None:
            print(f"   '{result.caption.text}', Confidence {result.caption.confidence:.4f}")

        return result

