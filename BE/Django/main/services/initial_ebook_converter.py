from ebooklib import epub
from typing import Dict, Optional
from PIL import Image
import io
import uuid
import os
from config.settings.base import STATIC_ROOT
from datetime import datetime
import six
from .s3_storage import S3Client
import numpy as np

class InitialEbookConverter:
    def __init__(self):
        self.cover_template = six.b('''<?xml version="1.0" encoding="UTF-8"?>
            <!DOCTYPE html>
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
            <head>
            </head>
            <body>
            <img src="" alt="" style="max-width: 100%; max-height: 100%"/>
            </body>
            </html>''')

    def get_binary(self, image_content) -> Optional[bytes]:
        """
        이미지 바이너리 생성
        Args:
            image_content: 파일 경로/파일 객체이거나 numpy array
        """
        if image_content is not None:
            try:
                # 이미지 바이너리 준비
                if isinstance(image_content, np.ndarray):
                    image = Image.fromarray(image_content)
                else:
                    image = Image.open(image_content)

                # 메모리 버퍼에 JPEG로 저장
                image_bytes = io.BytesIO() # 메모리 내에서 바이너리 데이터 저장할 준비 (메모리 버퍼 준비)
                image.save(image_bytes, format='JPEG') # 메모리 버퍼에 JPEG 바이너리 데이터 저장
                image_bytes = image_bytes.getvalue() # 메모리 버퍼에서 바이너리 데이터를 가져옴
                return image_bytes
            
            except Exception as e:
                print(f'이미지 처리 중 에러 발생: {str(e)}')
                return None
        return None

    def set_cover_image(self, book: epub.EpubBook, cover_image) -> None:
        """
        커버 이미지 설정
        """
        if cover_image is not None:
            # 이미지 바이너리 준비
            image_bytes = self.get_binary(cover_image)
            if image_bytes:
                # 커버 이미지 설정
                book.set_cover("cover.jpg", image_bytes) # EPUB에 바이너리 형태의 이미지 저장
    
    def set_image(self, book: epub.EpubBook, image_content, content: str, image_name: str) -> str:
        """
        본문에 이미지 추가
        """
        if image_content is not None:
            # 이미지 추가
            image_bytes = self.get_binary(image_content)
            if image_bytes:
                epub_img = epub.EpubItem(
                    file_name=f'images/{image_name}', 
                    media_type='image/jpeg', 
                    content=image_bytes
                )
                book.add_item(epub_img)

                # 이미지 본문에 추가
                content += f'<div class="image-container"><img src="images/{image_name}" alt=""></div>'
        return content

    def make_book(self, text_images: Dict) -> Dict:
        """
        전달된 텍스트와 이미지를 ebook(접근성 적용X)으로 만드는 함수
        Args:
            text_images: text와 image data가 포함된 딕셔너리 -> text_images.py와 동일한 형식이어야 함
        Returns:
            Dict: epub 다운로드 링크, dtype, metadata(title, author, created_at, cover)
        """
        # 새 EPUB 책 객체 생성
        book = epub.EpubBook()
        book.set_template('cover', self.cover_template)

        # 메타데이터 설정
        metadata = text_images.get('metadata', {})
        book.set_title(metadata.get('title', '(제목 미정)'))
        book.set_language('ko') 
        book.add_author(metadata.get('author', '(작자 미상)'))
        self.set_cover_image(book, metadata.get('cover', None))

        # CSS 스타일 추가
        style = '''
        @namespace epub "http://www.idpf.org/2007/ops";
        body { margin: 20px; }
        h1 { text-align: center; margin: 20px 0; }
        h2 { text-align: center; margin: 20px 0; }
        p { line-height: 1.6; margin: 10px 0; }
        .image-container { margin: 20px 0; width: 100% }
        .image-container img { 
            max-width: 100%;
            display: block;
            width: 100%;
            height: auto;
            margin: 0 auto; 
        }
        '''
        nav_css = epub.EpubItem(
            uid='style_nav',
            file_name='style/nav.css',
            media_type='text/css',
            content=style
        )
        book.add_item(nav_css)

        # 본문 처리 - 챕터(총 1단계)가 존재한다고 가정.
        chapter = None
        content = ''
        chapter_number = 0
        chapters = []
        for page in text_images.get('pages', []):
            if not page.get('sections'):
                continue

            for section in page.get('sections', []):
                if not section:
                    continue
                type = section.get('type', '')
                if type == 'title':
                    if chapter: 
                        # 이전 챕터 마무리
                        chapter.set_content(f'<html><body>{content}</body></html>')
                        chapter.add_item(nav_css) # 각 챕터에도 nav_css를 추가해줘야 css가 먹힘
                        book.add_item(chapter)
                        chapters.append(chapter)
                        content = ""
                    
                    # 새로운 챕터 만들기
                    title = section.get('content', {}).get('texts', ["챕터 미정"])[0]
                    chapter_number += 1
                    file_name = f'chapter_{chapter_number}.xhtml'
                    chapter = epub.EpubHtml(title=title, file_name=file_name, lang='ko')
                    content += f'<h1>{title}</h1>'
                    
                elif type == 'text':
                    texts = section.get('content', {}).get('texts', ["본문 없음"])
                    for text in texts:
                        if text.startswith('"') and text.endswith('"'):
                            content += f'<p>{text}</p>'
                        elif text.startswith('"'):
                            content += f'<p><span>{text}</span>'
                        elif text.endswith('"'):
                            content += f'<span>{text}</span></p>'
                        else:
                            content += f'<span>{text}</span>'
                
                elif type == 'image':
                    image = section.get('content', {}).get('image')
                    if image is not None:
                        image_name = f'{page.get('page_number', 0)}_{section.get('sequence', 0)}.jpg'
                        content = self.set_image(book, image, content, image_name)

        # 마지막 챕터 처리
        if chapter and content:
            chapter.set_content(f'<html><body>{content}</body></html>')
            chapter.add_item(nav_css)
            book.add_item(chapter)
            chapters.append(chapter)
        
        # 목차 만들기
        toc = []
        for chapter in chapters:
            chapter_link = epub.Link(
                href=chapter.file_name,
                title=chapter.title,
                uid=chapter.id
            )
            toc.append(chapter_link)
        
        book.toc = tuple(toc)

        # spine 설정 -> EPUB 리더가 콘텐츠를 표시할 순서 정의
        book.spine = ['nav'] + chapters

        # navigation 파일 추가
        book.add_item(epub.EpubNcx()) # 오래된 EPUB 리더를 위한 네비게이션 XML 파일
        book.add_item(epub.EpubNav()) # 최신 EPUB 3.0 표준의 네비게이션 HTML5 파일

        # 파일명 및 경로 설정
        filename = f'{uuid.uuid4()}.epub'

        # s3에 저장
        buffer = io.BytesIO()
        try:
            epub.write_epub(buffer, book) # 버퍼에 epub 저장
            buffer.seek(0)
            s3_key = f'temp/epub/{filename}' # S3 내 저장 경로
            S3Client.upload_fileobj(file_object=buffer, s3_key=s3_key) # 파일 업로드
            download_url = S3Client.generate_download_url(s3_key=s3_key) # 다운로드 링크 생성

            return {
                "epub": download_url,
                "dtype": "REGISTERED",
                "metadata": {
                    "title": metadata.get('title', '(제목 미정)'),
                    "author": metadata.get('author', '(작자 미상)'),
                    "created_at": metadata.get('created_at', datetime.now().isoformat()),
                    "cover": metadata.get('cover') # numpy array
                }
            }
        except Exception as e:
            print(f'EPUB 파일 생성 중 에러 발생: {str(e)}')
            return None

        
