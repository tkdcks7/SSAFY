import pandas as pd 
from datetime import datetime

##--------------------
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

class DemographicsBookRecommendation:
    def __init__(self) -> None:
        self.score_df = None

    def load_db_data(self):
        mysql_connector = MysqlConnector()
        mysql_connector.mysql_connect()
        query = """
            select b.book_id, st.member_id, sum(st.sc) as score, m.gender, m.birth 
            from book b 
            join ((select book_id, member_id, sum(score-3)*3 as sc from review group by book_id, member_id) 
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

        print(self.score_df)

        # 나이대 계산
        current_year = datetime.now().year
        self.score_df['age'] = current_year - self.score_df['birth'].apply(lambda x: x.year)
        self.score_df['age_group'] = self.score_df['age'].apply(lambda age: (age // 10) * 10)

        # 성별 처리
        self.score_df['gender'] = self.score_df['gender'].apply(lambda x: 1 if x == 'M' else 0)


    def calculate_book_score(self, N=5):   
         # 연령대, 성별, 도서 별로 평균 점수와 점수 개수 계산
        book_scores = self.score_df.groupby(['age_group', 'gender', 'book_id']).agg(
            score_mean=('score', 'mean'),
            score_count=('score', 'size')
        ).reset_index()

        # 연령대, 성별로 묶어서 N개의 도서를 평균 점수와 점수 개수 기준으로 정렬
        filtered_scores = book_scores.groupby(['age_group', 'gender']).apply(
            lambda x: x.sort_values(by=['score_mean', 'score_count'], ascending=False).head(N)
        ).reset_index(drop=True)

        # 전체 연령대 - 도서 별로만 평균 점수와 점수 개수 계산
        total_book_scores = self.score_df.groupby(['book_id']).agg(
            score_mean=('score', 'mean'),
            score_count=('score', 'size')
        ).reset_index()

        # N개 테마를 평균 점수와 점수 개수 기준으로 정렬 
        total_filtered_scores = total_book_scores.sort_values(
            by=['score_mean', 'score_count'], ascending=False
        ).head(N).reset_index(drop=True)
        
        # 리스트로 변환
        result = []
        
        for (age_group, gender), group_data in filtered_scores.groupby(['age_group', 'gender']):
            current = {
                "r_type": RType['demographics'],
                "target_id": f"{age_group}_{gender}",
                "book_list": group_data['book_id'].tolist() 
            }
            result.append(current)

        # 전체 데이터 추가
        current = {
            "r_type": RType['demographics'],
            "target_id": "Total",
            "book_list": total_filtered_scores['book_id'].tolist() 
        }

        return result    

    def save_data(self, result):
        mongoDbConnector = MongoDBConnector()

        mongoDbConnector.mongo_connect()
        try:
            col = mongoDbConnector.mongo_get_collection("recommendations", "string")
            mongoDbConnector.mongo_delete_many(col, {'r_type': 'demographics'})
            mongoDbConnector.mongo_save_many(col, result)
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
