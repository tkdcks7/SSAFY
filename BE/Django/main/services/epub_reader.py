import ebooklib
from ebooklib import epub
from datetime import datetime
import re 

class EpubReader:
    ## 입출력 함수
    def read_images_from_epub(book: epub.EpubBook):
        images = book.get_items_of_type(ebooklib.ITEM_IMAGE)
        return images

    def read_epub_from_s3_path(path: str):
        pass 

    
    def read_epub_from_local(path: str):
        return epub.read_epub(path) 

    def write_epub_to_local(path: str, name: str, book: epub.EpubBook):
        current_time = datetime.now().strftime('%Y%m%d_%H%M%S')  
        epub.write_epub(f'{path}{name}_{current_time}.epub', book)


    # 이미지에 Alt 추가하여 다시 epub 파일 생성하는 함수 
    def append_alt_to_image(book: epub.EpubBook, image_list: list):
        for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
            content = item.get_content().decode('utf-8')
            
            # 1. 각 이미지 파일 이름과 캡션을 <img> 태그에 반영
            for image_id, caption, _ in image_list:
                # 모든 Alt 삭제 
                img_tag_pattern = f'src="{image_id}"'
                content = re.sub(rf'(<img[^>]*?)\s*alt="[^"]*"([^>]*{img_tag_pattern}[^>]*>)', 
                                rf'\1 \2', content) # 앞 alt
                content = re.sub(rf'(<img[^>]*?)\s*({img_tag_pattern}[^\>]alt="[^"]*"[^\>]\>)', 
                                rf'\1 \2', content) # 뒤 alt
                content = content.replace(f'src="{image_id}"', f'src="{image_id}" alt="{caption}"')
            
            # 2. 변경된 HTML 콘텐츠를 다시 EPUB에 저장
            item.set_content(content.encode('utf-8'))

        return book 