import ebooklib
from ebooklib import epub
from datetime import datetime
import re 
from bs4 import BeautifulSoup
import bs4

class EpubReader:
    ## 입출력 함수
    def read_images_from_epub(book: epub.EpubBook):
        images = book.get_items_of_type(ebooklib.ITEM_IMAGE)
        return images

    ## 표지 처리 함수 
    def read_cover_image_from_epub(book: epub.EpubBook):
        cover_image = book.get_items_of_type(ebooklib.ITEM_COVER)
        return list(cover_image)
    
    def read_epub_from_s3_path(path: str):
        pass 

    
    def read_epub_from_local(path: str):
        return epub.read_epub(path) 

    def write_epub_to_local(path: str, name: str, book: epub.EpubBook):
        print(f"path {path}")
        current_time = datetime.now().strftime('%Y%m%d_%H%M%S')  
        epub.write_epub(f'{path}{name}_{current_time}.epub', book)


    # 이미지에 Alt 추가하여 다시 epub 파일 생성하는 함수 
    def append_alt_to_image(book: epub.EpubBook, image_list: list):
        print(f"image_id: {image_list[0][0]}")
        for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
            content = item.get_content().decode('utf-8')
            soup = BeautifulSoup(content, 'html.parser')

            head = soup.head
            body = soup.body

            # 이미지의 alt 속성 업데이트
            for image_id, caption, _ in image_list:
                img_tag = body.find('img', {'src': image_id})
                if img_tag:
                    img_tag['alt'] = caption
            
            # 2. 변경된 HTML 콘텐츠를 다시 EPUB에 저장
            updated_content = f"<html>{head}{body}</html>"
            item.set_content(updated_content.encode('utf-8'))

        return book 
    

    def append_alt_to_image_without_decode(book: epub.EpubBook, image_list: list):
        print(f"image_id: {image_list[0][0]}")
        for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
            content = item.get_content()
            soup = BeautifulSoup(content, 'html.parser')
            
            head = soup.head
            body = soup.body

            # 이미지의 alt 속성 업데이트
            for image_id, caption, _ in image_list:
                img_tag = body.find('img', {'src': image_id})
                if img_tag:
                    img_tag['alt'] = caption
            
            # 2. 변경된 HTML 콘텐츠를 다시 EPUB에 저장
            updated_content = f"<html>{head}{body}</html>"
            item.set_content(updated_content.encode('utf-8'))

        return book 
    # 표지 이미지의 image_id 기준으로 coverAlt 반환 
    def get_cover_alt(book: epub.EpubBook, cover_id):
        for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
            content = item.get_content().decode('utf-8')
            soup = BeautifulSoup(content, 'html.parser')
            
            img_cover = soup.find('img', {'src': cover_id})
            return img_cover['alt'] 

        return ""
    

    def set_sentence_index(book: epub.EpubBook):
        """
        epub html문서의 span태그에 data-index 속성 추가
        """
        index = 0

        for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
            # html 문서 파싱
            soup = BeautifulSoup(item.get_content(), 'html.parser')

            # 모든 span 태그 찾기
            spans = soup.find_all('span')

            # 각 span 태그에 data-index 속성 추가
            for span in spans:
                if span.get_text(strip=True): # span 태그 안에 문장이 있을 때만
                    span['data-index'] = str(index)
                    index += 1
            
            # 수정된 내용을 다시 저장
            item.set_content(str(soup).encode())
        
        return book

    def get_sentence_with_index(book: epub.EpubBook):
        """
            book에서 문장 추출
            : data-index, text가 담긴 리스트로 반환 
        """
        sentence_list = [] 
        for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
            soup = BeautifulSoup(item.get_content(), 'html.parser')
            spans = soup.find_all('span')

            for span in spans:
                if span['data-index']:
                    current = {
                        "data-index": span['data-index'],
                        "text": span.get_text()
                    }   
                    sentence_list.append(current) 
        
        return book

    def set_sentence_text_with_index(book: epub.EpubBook, sentence_list):
        """
            수정된 문장을 book에 적용
        """

        # 딕셔너리로 변환 
        sentence_dict = {
            sentence['data-index']: sentence['text'] 
            for sentence in sentence_list
        }


        for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
            soup = BeautifulSoup(item.get_content(), 'html.parser')
            spans = soup.find_all('span')

            for span in spans:
                if span['data-index'] in sentence_dict:
                    span.string = sentence_dict[span['data-index']]

            item.set_content(str(soup))

        return book