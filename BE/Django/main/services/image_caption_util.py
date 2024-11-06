import os
from config.settings import base
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential

class AzureImageAnalysis:
    def __init__(self):
        self.end_point = base.AZURE_VISION_ENDPOINT
        self.secret_key = base.AZURE_VISION_KEY
        self.region = base.AZURE_VISION_REGION

        # 생성될 때 연결
        self.connectSynchronousClient()
    
    def connectSynchronousClient(self):
        # Image analysis client 생성 (동기)
        self.client = ImageAnalysisClient(
            endpoint=self.end_point,
            credential=AzureKeyCredential(self.secret_key)
        )

    def analyzeImage(self, image):
        result = self.client.analyze(
            image_data=image,
            visual_features=[VisualFeatures.CAPTION]
        )
        
        if result.caption is not None:
            print(f"   '{result.caption.text}', Confidence {result.caption.confidence:.4f}")

