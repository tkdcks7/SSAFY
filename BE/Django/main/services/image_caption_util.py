from config.settings import base
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.aio import ImageAnalysisClient as AsyncImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
import openai
import base64
import json 
import tiktoken
import re  
import asyncio

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
        self.ic_system_message = """
        시각장애인을 위해 이미지 캡션을 추가하려고 합니다. 
        당신의 역할은 이미지를 한글로 설명하는 것입니다. 
        이미지 설명은 최대 2문장이어야 합니다. 첫 문장은 반드시 '~한 그림.' 혹은 '~한 사진.'으로 끝나고, 
        두번째 문장은 '~다'로 끝나야 합니다. 
        설명에는 시각장애인이 이해할 수 있도록 시각적 정보가 포함되어야 하며, 주관적 내용은 제외합니다.
        모든 설명은 반드시 한글이어야 합니다!
        """

        self.ic_user_message_template = """
        아래 그림을 설명해 주세요. 그림에서 중점적으로 볼 수 있는 키워드는 다음과 같습니다.
        keyword: {keyword}
        """

        self.pc_system_message = """
        당신의 역할은 전자책의 띄어쓰기를 교정하는 것입니다.
        이 띄어쓰기는 OCR 과정에서 발생하였습니다.

        1. 주어진 [{data-index, text}, {data-index, text}, ... ] 배열에서 text를 읽고 띄어쓰기를 교정하시오.
        이때, text의 다른 것이 바뀌면 안됩니다. 오로지 띄어쓰기만 수정되어야 합니다. 띄어쓰기가 아닌 맞춤법이 틀렸어도 그것을 수정할 수 없습니다.  
        2. 결과는 반드시 다음과 같은 형식으로 반환하십시오. [{data-index, text}, {data-index, text}, ... ]
        3. 이외 안내 메시지는 필요 없습니다. 
        """

        self.pc_user_message_template = """
        
        데이터는 다음과 같습니다. 

        {data}
        """

        self.apc_system_message = """
        당신의 역할은 전자책의 띄어쓰기를 교정하는 것입니다.
        이 띄어쓰기는 OCR 과정에서 발생하였습니다.

        1. 주어진 [{sequence, text}, {sequence, text}, ... ] 배열에서 text를 읽고 띄어쓰기를 교정하시오.
        이때, text의 다른 것이 바뀌면 안됩니다. 오로지 띄어쓰기만 수정되어야 합니다. 띄어쓰기가 아닌 맞춤법이 틀렸어도 그것을 수정할 수 없습니다.  
        2. 결과는 반드시 다음과 같은 형식으로 반환하십시오. [{sequence, text}, {sequence, text}, ... ]
        3. 이외 안내 메시지는 필요 없습니다. 
        """

        self.apc_user_message_template = """
        
        데이터는 다음과 같습니다. 

        {data}
        """

    def set_sync_client(self):
        self.client = openai.OpenAI(api_key = base.OPENAI_AUTH)
    
    def set_async_client(self):
        self.async_client = openai.AsyncOpenAI(api_key = base.OPENAI_AUTH)

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
                        {"role": "system", "content": self.ic_system_message},
                        {"role": "user", "content": 
                            [
                                {
                                    "type": "text",
                                    "text": self.ic_user_message_template.format(keyword=azure_caption)
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
    
    # 비동기 처리 
    async def analyze_openai_image_async(self, processed_images):
        task_list = [] 
        for file_name, azure_caption, image_content in processed_images:
            task_list.append(self.send_async_image_request(file_name, azure_caption, image_content))
        
        # 비동기 작업 종료 후 결과 처리
        updated_images = await asyncio.gather(*task_list)
        return updated_images


    async def send_async_image_request(self, file_name, azure_caption, image_content):
        # image_content를 base64로 인코딩
        image_base64 = base64.b64encode(image_content).decode("utf-8")  

        try:
            # GPT-4 Vision에게 base64 인코딩된 이미지 데이터를 프롬프트로 전달
            response = await self.async_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.ic_system_message},
                    {"role": "user", "content": 
                        [
                            {
                                "type": "text",
                                "text": self.ic_user_message_template.format(keyword=azure_caption)
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
            return (file_name, gpt_caption, image_content)
        except Exception as e:
            print(f"OpenAIAnalysis GPT-4 Vision 캡셔닝 오류: {e}")
            return (file_name, f"Azure Caption: {azure_caption}. GPT-4 Caption: 실패", image_content)

    # def correct_punctuation(self, processed_text):
    #     result = processed_text
    #     try:
    #         # GPT-4 에게 규격화된 텍스트 데이터를 프롬프트로 전달
    #         processed_text_str = json.dumps(processed_text, ensure_ascii=False)

    #         response = self.client.chat.completions.create(
    #             model="gpt-4o-mini",
    #             messages=[
    #                 {"role": "system", "content": self.pc_system_message},
    #                 {"role": "user", "content": 
    #                     [
    #                         {
    #                             "type": "text",
    #                             "text": self.pc_user_message_template.format(data=processed_text_str)
    #                         }
    #                     ]
    #                 }   
    #             ],
    #         )
    #         gpt_correction = response.choices[0].message.content
    #         result = json.loads(gpt_correction)
    #     except Exception as e:
    #         print(f"OpenAIAnalysis GPT-4 띄어쓰기 교정 오류: {e}")
            
    #     return result
    
    def correct_punctuation(self, processed_text):
        result = []
        try:
            processed_text_str = json.dumps(processed_text, ensure_ascii=False)
            token_limit = 15000  # 토큰 제한 (응답 제한이 16384기 때문) 

            total_token_count = self.get_token_count(processed_text_str)
            
            if total_token_count > token_limit:
                temp_text = []
                temp_token_count = 0

                for text_part in processed_text:
                    part_token_count = self.get_token_count(json.dumps(text_part, ensure_ascii=False))
                    
                    if temp_token_count + part_token_count <= token_limit:
                        temp_text.append(text_part)
                        temp_token_count += part_token_count
                    else:
                        response = self.send_request(temp_text)
                        result.extend(response)
                        temp_text = [text_part]
                        temp_token_count = part_token_count

                if temp_text:
                    response = self.send_request(temp_text)
                    result.extend(response)

            else:
                response = self.send_request(processed_text)
                result.extend(response)

        except Exception as e:
            print(f"OpenAIAnalysis GPT-4 띄어쓰기 교정 오류: {e}")

        if len(result) == 0:
            print("correct_punctuation: No Result")
            result = processed_text 
        return result

    def send_request(self, text_part):
        try:
            text_part_str = json.dumps(text_part, ensure_ascii=False)
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.pc_system_message},
                    {"role": "user", "content": self.pc_user_message_template.format(data=text_part_str)}
                ],
            )
            gpt_correction = response.choices[0].message.content
            return self.parse_json_data(gpt_correction)
        except Exception as e:
            print(f"OpenAIAnalysis GPT-4 요청 오류: {e}")
            return [] 
        
    async def send_async_request(self, text_part):
        try:
            text_part_str = json.dumps(text_part, ensure_ascii=False)
            response = await self.async_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.apc_system_message},
                    {"role": "user", "content": self.apc_user_message_template.format(data=text_part_str)}
                ],
            )
            gpt_correction = response.choices[0].message.content
            return self.parse_json_data(gpt_correction)
        except Exception as e:
            print(f"OpenAIAnalysis GPT-4 요청 오류: {e}")
            return [] 
        
    async def correct_punctuation_async(self, processed_text):
        result = []
        try:
            processed_text_str = json.dumps(processed_text, ensure_ascii=False)
            token_limit = 100 # 병렬 처리를 위해 max token을 하향 조정  

            total_token_count = self.get_token_count(processed_text_str)
            print(f"total_token_count {total_token_count}")
            task_list = [] # 비동기로 수행될 작업들 
            
            if total_token_count > token_limit:
                temp_text = []
                temp_token_count = 0

                for text_part in processed_text:
                    part_token_count = self.get_token_count(json.dumps(text_part, ensure_ascii=False))
                    
                    if temp_token_count + part_token_count <= token_limit:
                        temp_text.append(text_part)
                        temp_token_count += part_token_count
                    else:
                        task_list.append(self.send_async_request(temp_text))
                        temp_text = [text_part]
                        temp_token_count = part_token_count

                if temp_text:
                    task_list.append(self.send_async_request(temp_text))

            else:
                task_list.append(self.send_async_request(processed_text))

            responses = await asyncio.gather(*task_list, return_exceptions=True)
            for response in responses:
                if isinstance(response, list):
                    result.extend(response)
                else:
                    print(f"OpenAIAnalysis GPT-4 응답 오류: {response}")

        except Exception as e:
            print(f"OpenAIAnalysis GPT-4 띄어쓰기 교정 오류: {e}")

        if len(result) == 0:
            print("correct_punctuation_async: No Result")
            result = processed_text 
        return result
    
    def get_token_count(self, text, model_name="gpt-4o-mini"):
        encoding = tiktoken.encoding_for_model(model_name)
        tokens = encoding.encode(text)
        return len(tokens)
    
    def parse_json_data(self, text):
        pattern = r"\[.*\]"
        matched_result = re.search(pattern, text) 
        result = []
        if matched_result:
            result = json.loads(matched_result.group())
        
        return result 
    

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