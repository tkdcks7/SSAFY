import ebooklib
from ebooklib import epub
from ..epub_util.epub_reader import EpubReader

class ImageCaptioner:
    def image_captioning(epub: epub):
        # 1. epub 파일에서 이미지 읽기
        image_list = EpubReader.read_images_from_epub(epub)
        # 2. 이미지 파일을 azure로 이미지 캡셔닝

        # 3. 이미지 파일을 openai로 이미지 캡셔닝

        # 4. 추가된 캡션을 이미지에 추가 

        return image_list