import ebooklib
from ebooklib import epub
from datetime import datetime

class EpubReader:
    def read_images_from_epub(book: epub.EpubBook):
        images = epub.get_items_of_type(ebooklib.ITEM_IMAGE)
        return images

    def read_epub_from_s3_path(path: str):
        pass 

    
    def read_epub_from_local(path: str):
        return epub.read_epub(path) 

    def write_epub_to_local(path: str, name: str, book: epub.EpubBook):
        current_time = datetime.now().strftime('%Y%m%d_%H%M%S')  
        epub.write_epub(f'{path}{name}_{current_time}.epub', book)