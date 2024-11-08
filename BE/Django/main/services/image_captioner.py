import ebooklib
from ebooklib import epub
from .epub_reader import EpubReader
from .image_caption_util import AzureImageAnalysis, OpenAIAnalyzer

class ImageCaptioner:
    # staticmethod를 이용하여 self 인자를 전달하지 않도록 한다 (정적 메소드)
    @staticmethod
    async def image_captioning(book: epub):
        # 1. epub 파일에서 이미지 읽기
        image_list = EpubReader.read_images_from_epub(book)
        # 2. 이미지 파일을 azure로 이미지 캡셔닝
        processed_images = []
        azure_image_analysis = AzureImageAnalysis()
        for im in image_list:
            azure_result = await azure_image_analysis.analyze_image_async(im.get_content())
            processed_images.append((im.file_name, azure_result.caption.text, im.get_content()))

        # 3. 이미지 파일을 openai로 이미지 캡셔닝
        open_ai_analyzer = OpenAIAnalyzer()
        openai_result = open_ai_analyzer.analyze_openai_image(processed_images)

        # 4. 추가된 캡션을 이미지에 추가 
        processed_book = EpubReader.append_alt_to_image(book, openai_result)
        EpubReader.write_epub_to_local("./staticfiles/", "valentin_procceessed", processed_book)

        # 5. 바뀐 책을 반환 
        return processed_book