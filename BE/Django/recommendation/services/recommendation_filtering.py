import pandas as pd 
from datetime import datetime
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np 
##--------------------
from .dbutil import MysqlConnector, MongoDBConnector
from .datacenter import RType

## 이 추천에서 join 할 때는 left outer join을 사용한다 -> 모든 회원의 평가값을 비교해야 하기 때문이다.

class SimilarLikesBookRecommendation:
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
    
    def calculate_score_similarity(self):
        self.score_df = self.score_df.groupby(['book_id', 'member_id']).agg({'score': 'mean'}).reset_index()
        score_pivot_df = self.score_df.pivot(index='book_id', columns='member_id', values='score')
        score_pivot_df.fillna(0, inplace=True) 

        self.score_similarity = cosine_similarity(score_pivot_df)
        self.book_ids = score_pivot_df.index.tolist() # 도서 id 저장 

    
    def extract_similar_theme(self, N=5):
        final_df = np.array(self.score_similarity)
        indices = np.argsort(-final_df, axis=1)[:, :N+1]
        
        result = [
            {
                "r_type": RType['similarLikesBook'],
                "target_id": self.book_ids[i],
                "book_list": self.book_ids[indices[i][indices[i] != i]][:N].tolist()
            }
            for i in range(final_df.shape[0])
        ]

        return result
    
    def save_data(self, result):
        mongoDbConnector = MongoDBConnector()

        mongoDbConnector.mongo_connect()
        try:
            col = mongoDbConnector.mongo_get_collection("recommendations", "long")
            mongoDbConnector.mongo_delete_many(col, {'r_type': RType['similarLikesBook']})
            mongoDbConnector.mongo_save_many(col, result)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            mongoDbConnector.mongo_disconnect()

    
    def get_recommendation(self, N=5):
        self.load_db_data()
        self.calculate_score_similarity() 
        result = self.extract_similar_theme(N)
        self.save_data(result)
        return result 


