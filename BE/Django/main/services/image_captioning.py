import ebooklib
from ebooklib import epub
from .epub_reader import EpubReader
from .image_caption_util import AzureImageAnalysis

class ImageCaptioner:
    # staticmethod를 이용하여 self 인자를 전달하지 않도록 한다 (정적 메소드)
    @staticmethod
    async def image_captioning(epub: epub):
        # 1. epub 파일에서 이미지 읽기
        image_list = EpubReader.read_images_from_epub(epub)
        # 2. 이미지 파일을 azure로 이미지 캡셔닝
        processed_images = []
        azure_image_analysis = AzureImageAnalysis()
        for im in image_list:
            azure_result = await azure_image_analysis.analyze_image_async(im.get_content())
            im.caption = azure_result.caption.text 
            processed_images.append(im)
        print(processed_images[0]) 

        # 3. 이미지 파일을 openai로 이미지 캡셔닝

        # 4. 추가된 캡션을 이미지에 추가 

        return processed_images