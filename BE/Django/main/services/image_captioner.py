import ebooklib
from ebooklib import epub
from .epub_reader import EpubReader
from .image_caption_util import AzureImageAnalysis, OpenAIAnalysis
from typing import Dict

### ------------------------
from main.services.epub_accessibility_util import EpubAccessibilityConverter

class ImageCaptioner:
    # staticmethod를 이용하여 self 인자를 전달하지 않도록 한다 (정적 메소드)
    @staticmethod
    async def image_captioning(book: epub, metadata: Dict):

        # 1. epub 파일에서 이미지 읽기
        image_list = EpubReader.read_images_from_epub(book)
        
        cover_image = EpubReader.read_cover_image_from_epub(book)

        # 2. 이미지 파일을 azure로 이미지 캡셔닝
        processed_images = []
        azure_image_analysis = AzureImageAnalysis()
        try:
            for im in image_list:
                azure_result = await azure_image_analysis.analyze_image_async(im.get_content())
                processed_images.append((im.file_name, azure_result.caption.text, im.get_content()))
            for cm in cover_image:
                azure_result = await azure_image_analysis.analyze_image_async(cm.get_content())
                processed_images.append((cm.file_name, azure_result.caption.text, cm.get_content()))
        finally:
            await azure_image_analysis.close_async_client()

        # 3. 이미지 파일을 openai로 이미지 캡셔닝
        open_ai_analyzer = OpenAIAnalysis()
        openai_result = open_ai_analyzer.analyze_openai_image(processed_images)

        # 4. 추가된 캡션을 이미지에 추가 
        processed_book = EpubReader.append_alt_to_image(book, openai_result)

        # 5. coverAlt 불러오기 
        metadata['cover_alt'] = EpubReader.get_cover_alt(processed_book, "cover.jpg")

        # 테스트
        # 접근성 적용
        epub_access = EpubAccessibilityConverter()
        epub_access.set_epub(processed_book)
        epub_access.format_body()
        formatted_book = epub_access.get_epub()

        EpubReader.write_epub_to_local("staticfiles/", "smile_formatted_book", formatted_book)
        EpubReader.write_epub_to_local("staticfiles/", "smile_processed_book", processed_book)
        EpubReader.write_epub_to_local("staticfiles/", "smile_book", book)
        # 6. 바뀐 책을 반환 
        return formatted_book, metadata 
    
    @staticmethod
    async def image_captioning_for_integration(book: epub, metadata: Dict):

        # 1. epub 파일에서 이미지 읽기
        image_list = EpubReader.read_images_from_epub(book)
        # 2. 이미지 파일을 azure로 이미지 캡셔닝
        processed_images = []
        azure_image_analysis = AzureImageAnalysis()
        try:
            for im in image_list:
                azure_result = await azure_image_analysis.analyze_image_async(im.get_content())
                processed_images.append((im.file_name, azure_result.caption.text, im.get_content()))
        finally:
            await azure_image_analysis.close_async_client()

        # 3. 이미지 파일을 openai로 이미지 캡셔닝
        open_ai_analyzer = OpenAIAnalysis()
        openai_result = open_ai_analyzer.analyze_openai_image(processed_images)

        # 4. 추가된 캡션을 이미지에 추가 
        processed_book = EpubReader.append_alt_to_image_without_decode(book, openai_result)

        # 5. coverAlt 불러오기 
        metadata['cover_alt'] = EpubReader.get_cover_alt(processed_book, "cover.jpg")

        # 6. 바뀐 책을 반환 
        return processed_book, metadata 