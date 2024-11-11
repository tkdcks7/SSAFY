import pandas as pd 

from .dbConnector import MysqlConnector, MongoDBConnector

RType = {
    "famous": "famous",
    "demographics": "demographics",
    "category": "category",
    "similarMember": "similarMember",
    "similarBook": "similarBook",
    "similarLikesBook": "similarLikesBook"
}

class FamousBookRecommendation:
    def __init__(self) -> None:
        self.score_df = None

    def load_db_data(self):
        mysql_connector = MysqlConnector()
        mysql_connector.mysql_connect()
        query = """
            select b.book_id, st.member_id, sum(st.sc) as score
            from book b 
            left join ((select book_id, member_id, sum(score-3)*3 as sc from review group by book_id, member_id) 
                        union all
                        (select book_id, member_id, count(*)*2 as sc from book_cart group by book_id, member_id) 
                        union all
                        (select book_id, member_id, count(*) as sc from likes group by book_id, member_id)) as st 
            join member m on st.member_id = m.member_id 
            on b.book_id = st.book_id 
            group by b.book_id, st.member_id
        """
        scores = mysql_connector.mysql_read_all(query)
        self.score_df = pd.DataFrame(scores) 

    # 베이지안 평균 계산 
    def bayesian_average(self, row, C, m):
        R = row['score_mean']   
        v = row['score_count']  
        return (C * m + R * v) / (C + v)

    def calculate_book_score(self, N=5):
        # 도서 별로 평균 점수와 점수 개수 계산
        book_scores = self.score_df.groupby(['book_id']).agg(
            score_mean=('score', 'mean'),     
            score_count=('score', 'size')     
        ).reset_index()

        # 베이지안 평균에 사용될 기준 값
        C = book_scores['score_count'].mean()  
        m = book_scores['score_mean'].mean()  

        # 각 도서별로 베이지안 평균 계산
        book_scores['bayesian_avg'] = book_scores.apply(lambda row: self.bayesian_average(row, C, m), axis=1)

        # 베이지안 평균을 기준으로 상위 10개 도서 추출
        top_books = book_scores.sort_values(by=['score_mean', 'bayesian_avg'], ascending=False).head(N)


        # 데이터 반환 
        data = {
            "r_type": RType["famous"],
            "book_list": top_books["book_id"].to_list()
        }
        return data 

    def save_data(self, result):
        mongoDbConnector = MongoDBConnector()

        mongoDbConnector.mongo_connect()
        try:
            # 카운터로 auto increment 구현 
            new_target_id = mongoDbConnector.get_next_sequence(RType["famous"])
            result["target_id"] = new_target_id
            col = mongoDbConnector.mongo_get_collection("recommendations", "long")
            mongoDbConnector.mongo_save(col, result)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            mongoDbConnector.mongo_disconnect()

    
    def get_recommendation(self, N=5):
        self.load_db_data()
        result = self.calculate_book_score(N)
        self.save_data(result)
        print(result)
        return result 
