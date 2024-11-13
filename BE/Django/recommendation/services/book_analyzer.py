
import pandas as pd 
from konlpy.tag import Okt
import re 
## ------------------------
from .dbutil import MysqlConnector, MongoDBConnector 


class BookAnalyzer:
    def __init__(self) -> None:
        self.books = None


    def load_db_data(self):
        mysql_connector = MysqlConnector()
        mysql_connector.mysql_connect()
        query = """
            select * from book
        """
        self.books = mysql_connector.mysql_read_all(query)
        


    # 줄거리 형태소 분석 
    def analyze_book_story_by_konlpy(self):
        # ##### 줄거리 데이터 전처리 
        okt = Okt()                 

        def sub_special(s): # 한글, 숫자, 영어 빼고 전부 제거
            if isinstance(s, float):  # 입력 값이 float일 경우 빈 문자열로 변환
                return ''
            return re.sub(r'[^ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z ]','',s)

        stops = ['의','가','이','은','들','는', '을', '좀','잘','걍','과','도','를','으로','자','에','와','한','하다']

        def morph_and_stopword(s):
            #형태소 분석
            tmp = okt.pos(s, norm=True, stem=True)

            tokens = []
            # 조사, 어미, 구두점 제외
            for token in tmp:
                if token[1] not in ['Josa', 'Eomi', 'Punctuation']:
                    tokens.append(token[0])
            
            #불용어 처리
            meaningful_words = [w for w in tokens if not w in stops]

            return ' '.join(meaningful_words)


        result = []

        for book in self.books:
            current = {
                "book_id": book["book_id"],
                "story": book["story"],
                "story_analysis": morph_and_stopword(sub_special(book["story"]))
            }
            result.append(current)
        
        return result 

    def save_data(self, result):
        mongoDbConnector = MongoDBConnector()

        mongoDbConnector.mongo_connect()
        try:
            col = mongoDbConnector.mongo_get_collection("analysis", "book_story")
            mongoDbConnector.mongo_delete_many(col, {})
            mongoDbConnector.mongo_save_many(col, result)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            mongoDbConnector.mongo_disconnect()
    
    def analyze_book_story(self):
        # 데이터 불러오기
        self.load_db_data() 
        # 분석
        result = self.analyze_book_story_by_konlpy()
        # mongodb 저장 
        self.save_data(result) 
        return result[:10]