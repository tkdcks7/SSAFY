import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
import re 

class EpubAccessibilityConverter:
    def __init__(self) -> None:
        self.epub = None 

    def apply_accessibility(self, book: epub.EpubBook):
        self.set_epub(book)
        self.format_body()
        return self.epub 
    
    def set_epub(self, book: epub.EpubBook):
        self.epub = book 
    
    def get_epub(self):
        return self.epub

    def format_body(self):
        if self.epub == None:
            return 
        
        for item in self.epub.get_items_of_type(ebooklib.ITEM_DOCUMENT):
            content = item.get_content().decode('utf-8')
            soup = BeautifulSoup(content, 'html.parser')

            head = soup.head
            body = soup.body
            
            # 1. 여러 줄 공백은 한 줄로 처리
            ## (1) \n 처리
            for p in body.find_all('p'):
                original_html = str(p)

                formatted_html = re.sub(r'\n\s*\n+', '\n', original_html)
                formatted_html = self.format_marks(formatted_html)
                
                # 내부 태그 유지를 위해 BS 사용 
                if formatted_html:
                    new_p = BeautifulSoup(formatted_html, 'html.parser')
                    p.replace_with(new_p)  
            ## (2) <br> 처리
            body = self.remove_br(soup)

            
            # 2. 변경된 HTML 콘텐츠 다시 EPUB으로 저장
            updated_content = f"<html>{head}{body}</html>"
            item.set_content(updated_content.encode('utf-8'))
    

    
    # ------- format_body 유틸 함수
    def remove_br(self, soup):
        html = str(soup)
        html = re.sub(r'(<br\s*/?>\s*){2,}', '<br/>', html)
        return BeautifulSoup(html, 'html.parser')
    
    def format_marks(self, text):
        # 1. 공백 제거 
        # (1) 기호 앞뒤 공백 제거
        text = re.sub(r'([\(\[\{])\s+', '\1', text)
        text = re.sub(r'\s+([\)\]\}])', '\1', text)
        text = re.sub(r'(\w)\s*([.,?!;:])', '\1\2 ', text)
        text = re.sub(r'([.,?!;:])\s+', '\1 ', text)

        # (2) 중복 공백 제거
        text = re.sub(r'\s{2,}', ' ', text)

        