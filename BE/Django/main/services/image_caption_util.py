from config.settings import base
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.aio import ImageAnalysisClient as AsyncImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
import openai
import base64

class AzureImageAnalysis:
    def __init__(self):
        self.end_point = base.AZURE_VISION_ENDPOINT
        self.secret_key = base.AZURE_VISION_KEY
        self.region = base.AZURE_VISION_REGION

        # 생성될 때는 비워둔다 
        self.async_client = None

    def get_sync_client(self):
        # Image analysis client 생성 (동기)
        self.sync_client = ImageAnalysisClient(
            endpoint=self.end_point,
            credential=AzureKeyCredential(self.secret_key)
        )
    
    async def get_async_client(self):
        if self.async_client is None:
            self.async_client = AsyncImageAnalysisClient(
                endpoint=self.end_point,
                credential=AzureKeyCredential(self.secret_key)
            )

    def analyze_image_sync(self, image):
        result = self.sync_client.analyze(
            image_data=image,
            visual_features=[VisualFeatures.CAPTION]
        )


        return result

    async def analyze_image_async(self, image):
        await self.get_async_client()
        result = await self.async_client.analyze(
            image_data=image,
            visual_features=[VisualFeatures.CAPTION]
        )
        return result
    
        
    async def close_async_client(self):
        if self.async_client:
            await self.async_client.close()
            self.async_client = None
    
## -------------------------------------
## -       openai = 1.54.3 버전        -
## -------------------------------------
class OpenAIAnalysis:
    def __init__(self, **kwargs):
        # System, user 메시지 분리 
        self.system_message = """
        시각장애인을 위해 이미지 캡션을 추가하려고 합니다. 
        당신의 역할은 이미지를 한글로 설명하는 것입니다. 
        이미지 설명은 최대 2문장이어야 합니다. 첫 문장은 반드시 '~한 그림.' 혹은 '~한 사진.'으로 끝나고, 
        두번째 문장은 '~다'로 끝나야 합니다. 
        설명에는 시각장애인이 이해할 수 있도록 시각적 정보가 포함되어야 하며, 주관적 내용은 제외합니다.
        """

        self.user_message_template = """
        아래 그림을 설명해 주세요. 그림에서 중점적으로 볼 수 있는 키워드는 다음과 같습니다.
        keyword: {keyword}
        """

        self.client = openai.OpenAI(api_key = base.OPENAI_AUTH)

    def analyze_openai_image(self, processed_images):
        updated_images = []
        for file_name, azure_caption, image_content in processed_images:
             # image_content를 base64로 인코딩
            image_base64 = base64.b64encode(image_content).decode("utf-8")  

            try:
                # GPT-4 Vision에게 base64 인코딩된 이미지 데이터를 프롬프트로 전달
                response = self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": self.system_message},
                        {"role": "user", "content": 
                            [
                                {
                                    "type": "text",
                                    "text": self.user_message_template.format(keyword=azure_caption)
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url":  f"data:image/jpeg;base64,{image_base64}"
                                    },
                                },
                            ]
                        }   
                    ],
                )
                gpt_caption = response.choices[0].message.content
                updated_images.append((file_name, gpt_caption, image_content))
            except Exception as e:
                print(f"OpenAIAnalysis GPT-4 Vision 캡셔닝 오류: {e}")
                updated_images.append((file_name, f"Azure Caption: {azure_caption}. GPT-4 Caption: 실패", image_content))

        return updated_images


## -------------------------------------
## -       openai = 0.28 버전          -
## - (다운그레이드하지 않으면 오류 발생) -
## -------------------------------------
class OpenAIAnalyzer:
    def __init__(self, **kwargs):
        self.prompt = """
            시각장애인을 위해 이미지 캡션을 추가하려고 합니다.
            아래 그림을 한글로 설명한 내용을 반환하세요.
            value는 최대 2문장이어야 합니다. 첫 문장은 반드시 '~한 그림.' 혹은 '~한 사진.'으로 끝나고, 
            두번째 문장은 '~다'로 끝나야 합니다. 시각장애인을 위한 설명이기 때문에 
            시각을 가진 사람이 이 그림에서 파악할 수 있는 내용을 담아주세요. 
            주관적인 내용이 들어가서는 안 됩니다.
            그림에서 아래 키워드를 중점적으로 볼 수 있습니다.
            keyword: 
        """
        openai.api_key = base.OPENAI_AUTH

    async def analyze_openai_image(self, processed_images):
        for file_name, azure_caption, image_content in processed_images:
            new_prompt = self.prompt+azure_caption
            # image_content를 base64로 인코딩
            image_base64 = base64.b64encode(image_content).decode("utf-8")  

            updated_images = []
            try:
                # GPT-4 Vision에게 base64 인코딩된 이미지 데이터를 프롬프트로 전달
                response = openai.ChatCompletion.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that provides image descriptions."},
                        {"role": "user", "content": f"{new_prompt}\n[이미지 데이터: {image_base64}]"}
                    ]
                )
                gpt_caption = response['choices'][0]['message']['content']
                updated_images.append((file_name, gpt_caption, image_content))

            except Exception as e:
                print(f"OpenAIAnalyzer GPT-4 Vision 캡셔닝 오류: {e}")
                updated_images.append((file_name, f"Azure Caption: {azure_caption}. GPT-4 Caption: 실패", image_content))

        return updated_images