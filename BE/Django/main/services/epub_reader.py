import ebooklib
from ebooklib import epub

class EpubReader:
    def read_images_from_epub(epub: epub.EpubBook):
        images = list(epub.get_items_of_type(ebooklib.ITEM_IMAGE))
        images_content = list(map(lambda ei: ei.get_content(), images))
        return images_content

    def read_epub_from_s3_path(path: str):
        pass 

    
    def read_epub_from_local(path: str):
        return epub.read_epub(path) 
