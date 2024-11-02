from ebooklib import epub
from typing import Dict
from PIL import Image
import io
import uuid

class InitialEbookConverter:

    def get_binary(self, image_content):
        """
        이미지 바이너리 생성
        """
        if image_content:
            # 이미지 바이너리 준비
            image = Image.open(image_content) # PIL 이미지 객체 생성
            image_bytes = io.BytesIO() # 메모리 내에서 바이너리 데이터 저장할 준비 (메모리 버퍼 준비)
            image.save(image_bytes, format='JPEG') # 메모리 버퍼에 JPEG 바이너리 데이터 저장
            image_bytes = image_bytes.getvalue() # 메모리 버퍼에서 바이너리 데이터를 가져옴
            return image_bytes
        return None

    def set_cover_image(self, book, cover_image):
        """
        커버 이미지 설정
        """
        if cover_image:
            # 이미지 바이너리 준비
            image_bytes = self.get_binary(cover_image)
            # 커버 이미지 설정
            book.set_cover("cover.jpg", image_bytes) # EPUB에 바이너리 형태의 이미지 저장
    
    def set_image(self, book, image_content, content, image_name):
        """
        본문에 이미지 추가
        """
        if image_content:
            # 이미지 추가
            image_bytes = self.get_binary(image_content)
            epub_img = epub.EpubItem(file_name=image_name, media_type='image/jpeg', content=image_bytes)
            book.add_item(epub_img)

            # 이미지 본문에 추가
            content += f'<p><img src="{image_name}" alt=""></p>'

    def make_book(self, text_images: Dict) -> Dict:
        """
        전달된 텍스트와 이미지를 ebook(접근성 적용X)으로 만드는 함수
        """
        # 새 EPUB 책 객체 생성
        book = epub.EpubBook()

        # 메타데이터 설정
        metadata = text_images.get('metadata', {})
        book.set_title(metadata.get('title', '(제목 미정)'))
        book.set_language('ko') 
        book.add_author(metadata.get('author', '(작자 미상)'))
        self.set_cover_image(book, metadata.get('cover', None))

        # 본문 처리 - 챕터(총 1단계)가 존재한다고 가정.
        chapter = None
        content = ''
        chapter_number = 0
        file_name = ''
        title = ''
        toc = [] # table of the contents
        for page in text_images.get('pages', [{}]):
            for section in page.get('sections', [{}]):
                type = section.get('type', '')
                if type == 'title':
                    if bool(chapter) is True: 
                        # 본문에 챕터 추가
                        chapter.set_content(content)
                        book.add_item(chapter)
                        # 챕터 테이블에 챕터 추가 (하이퍼링크도 추가)
                        link = epub.Link(file_name, title, chapter_number)
                        toc.append(link)
                        # content 초기화
                        content = ""
                    title = section.get('content', {}).get('texts', ["챕터 미정"])[0]
                    chapter_number += 1
                    file_name = f'chapter_{chapter_number}.xhtml'
                    chapter = epub.EpubHtml(title=title, file_name=file_name, lang='ko')
                    content += f'<h1>{title}</h1>'
                elif type == 'text':
                    texts = section.get('content', {}).get('texts', ["본문 없음"])
                    for text in texts:
                        content += f'<p>{text}</p>'
                elif type == 'image':
                    image = section.get('content', {}).get('image', None)
                    image_name = f'{page.get('page_number', 0)}_{section.get('sequence', 0)}.jpg'
                    self.set_image(book, image, content, image_name)

        # 목차 만들기
        toc = tuple(toc)
        book.toc = toc

        # ebook 만들기
        epub.write_epub(f'{uuid.uuid4()}.epub', book)
        