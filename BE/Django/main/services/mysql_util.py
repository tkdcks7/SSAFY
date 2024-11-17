from main.models import Member, Book, Category
from datetime import datetime

class MysqlUtil:
    
    def find_member_by_member_id(self, member_id: int) -> Member:
        """
        member_id로 Member 객체 찾기
        조건에 해당하는 회원이 존재하지 않을 때 DoesNotExist 예외 발생
        """
        return Member.objects.get(member_id=member_id)
    
    def save_book(
            self,
            member_id: int,
            category_id: str,
            title: str,
            cover_url: str,
            cover_alt: str,
            author: str,
            my_tts_flag: int,
            epub: str # 도서 이름
    ) -> Member:
        """
        새로운 Book 객체를 저장하는 함수
        회원이나 카테고리가 존재하지 않는 경우 DoesNotExist 예외 발생
        """
        member = Member.objects.get(member_id=member_id)
        category = Category.objects.get(category_id=category_id)
        epub_link = '/registered/'+epub

        return Book.objects.create(
            category=category,
            member=member,
            title=title,
            cover=cover_url,
            cover_alt=cover_alt,
            author=author,
            my_tts_flag=my_tts_flag,
            epub=epub_link,
            d_type='REGISTERED',
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    
    def getCategory(self, category_id) -> Category:
        return Category.objects.get(category_id=category_id)



