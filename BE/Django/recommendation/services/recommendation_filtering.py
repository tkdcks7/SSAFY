import pandas as pd 
from datetime import datetime
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
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

    
    def extract_similar_book(self, N=5):
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
        result = self.extract_similar_book(N)
        self.save_data(result)
        return result[:10]

class SimilarMemberRecommendation:
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
        score_pivot_df = self.score_df.pivot(index='member_id', columns='book_id', values='score')
        score_pivot_df.fillna(0, inplace=True) 

        # 속도 개선을 위해 numpy로 cosine similarity 계산
        score_matrix = score_pivot_df.to_numpy()
        dot_product = np.dot(score_matrix, score_matrix.T)
        norm = np.linalg.norm(score_matrix, axis=1)
        norm_matrix = np.outer(norm, norm) 
        self.score_similarity = dot_product / norm_matrix
        self.score_similarity[np.isnan(self.score_similarity)] = 0 
        
        self.member_ids = score_pivot_df.index.to_numpy()
        self.book_ids = score_pivot_df.columns.to_numpy() # 도서 id 저장 

        # 사용자별 평점 데이터 저장
        self.user_ratings = {
            member_id: group[['book_id', 'score']].to_numpy() 
            for member_id, group in self.score_df.groupby('member_id')
        }

    
    def extract_similar_member_book(self, member_index, member_id, N):
        # 유사도 순으로 사용자 인덱스 정렬 (자기 자신 제외)
        similar_users = self.score_similarity[member_index]
        similar_user_indices = np.argsort(similar_users)[::-1][1:]

        # 평가한 도서 목록 및 추천 점수 계산용 사전 생성
        # set으로 변환하여 검색 속도 최적화
        rated_books = {row[0] for row in self.user_ratings[member_id]}  
        book_scores = {}

        for sim_index in similar_user_indices:
            sim_user_id = self.member_ids[sim_index]
            sim_user_ratings = self.user_ratings[sim_user_id]

            for book_id, score in sim_user_ratings:
                # 사용자가 평가하지 않은 도서에 대해서만 계산한다 
                if book_id not in rated_books:
                    if book_id not in book_scores:
                        book_scores[book_id] = 0
                    book_scores[book_id] += similar_users[sim_index] * score

        # 상위 N개 도서 
        top_book_score = sorted(book_scores.items(), key=lambda x: x[1], reverse=True)[:N]

        current = {
            "r_type": "similarMember",
            "target_id": int(member_id),
            "book_list": [book_id for book_id, _ in top_book_score]
        }

        return current

    def extract_similar_member_books(self, N=5):
        # 속도 개선을 위해 리스트 내포 사용 
        result = [self.extract_similar_member_book(member_index, member_id, N)
                  for member_index, member_id in enumerate(self.member_ids)]
        return result

    def save_data(self, result):
        mongoDbConnector = MongoDBConnector()

        mongoDbConnector.mongo_connect()
        try:
            col = mongoDbConnector.mongo_get_collection("recommendations", "long")
            mongoDbConnector.mongo_delete_many(col, {'r_type': RType['similarMember']})
            mongoDbConnector.mongo_save_many(col, result)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            mongoDbConnector.mongo_disconnect()

    
    def get_recommendation(self, N=5):
        self.load_db_data()
        self.calculate_score_similarity() 
        result = self.extract_similar_member_books(N)
        self.save_data(result)
        return result[:10]

class SimilarBookRecommendation:
    def __init__(self) -> None:
        self.book_df = None 
        self.ctg_sml = None 
        self.story_list = None 
        self.str_sml = None 

    def load_book_data(self):
        mysql_connector = MysqlConnector()
        mysql_connector.mysql_connect()
        query = """
            select * from book
        """
        books = mysql_connector.mysql_read_all(query)
        self.book_df = pd.DataFrame(books)

    def load_story_data(self):
        mongo_connector = MongoDBConnector()
        mongo_connector.mongo_connect()
        col = mongo_connector.mongo_get_collection("analysis", "book_story")
        stories = mongo_connector.read_data_from_collection(col, {})
        
        story_data = []
        for doc in stories:
            story_data.append({
                "book_id": doc.get("book_id"),
                "story_analysis": doc.get("story_analysis", "")
            })
        
        self.story_df = pd.DataFrame(story_data)

        # 병합 (데이터 정합성을 위해)
        self.book_df = pd.merge(self.book_df, self.story_df, on="book_id", how="inner")
        self.story_list = self.book_df['story_analysis'].tolist()


    ## 1. 메타 데이터 기반 유사도 계산 -> 수치화 해서 비교할 데이터가 없어 보류 
    ## 2. 카테고리 데이터 기반 유사도
    ## 3. 줄거리 기반 유사도 계산 

    # 카테고리 데이터 기반 유사도
    
    def get_ctg_similarity(self):
        num_books = len(self.book_df)
        similarity_matrix = np.zeros((num_books, num_books))

        categories = self.book_df['category_id'].astype(str).str.zfill(3).tolist()

        for i in range(num_books):
            for j in range(i + 1, num_books):
                similarity_score = self.calculate_ctg_similarity(categories[i], categories[j])
                similarity_matrix[i, j] = similarity_score
                similarity_matrix[j, i] = similarity_score 

        self.ctg_sml = similarity_matrix

    # 줄거리 데이터 기반 유사도 (형태소 분석) 
    def calculate_ctg_similarity(self, category_a: str, category_b: str) -> float:
        weights = np.array([0.2, 0.3, 0.5]) 
        similarities = np.array([category_a[i] == category_b[i] for i in range(3)])
        return np.dot(similarities, weights)


    def get_str_similarity(self):
        tfidf = TfidfVectorizer()
        tfidf_matrix = tfidf.fit_transform(self.story_list)
        similarity_matrix = linear_kernel(tfidf_matrix, tfidf_matrix)
        self.str_sml = similarity_matrix
    
    def get_hybrid_similarity(self, category_weight=0.5, story_weight=0.5, N=5):
        # 각자 모델 계산
        self.get_ctg_similarity()
        self.get_str_similarity() 

        hybrid_similarity = (category_weight * self.ctg_sml) + (story_weight * self.str_sml)
        result = []
        for i, book_id in enumerate(self.book_df['book_id']):
            similar_indices = np.argsort(hybrid_similarity[i])[::-1][1:N+1]
            top_book_score = [(self.book_df['book_id'].iloc[j], hybrid_similarity[i][j]) for j in similar_indices]
            current = {
                "r_type": RType['similarBook'],
                "target_id": int(book_id),
                "book_list": [int(book_id) for book_id, _ in top_book_score]
            }
            result.append(current)

        return result
    
    def save_data(self, result):
        mongoDbConnector = MongoDBConnector()

        mongoDbConnector.mongo_connect()
        try:
            col = mongoDbConnector.mongo_get_collection("recommendations", "long")
            mongoDbConnector.mongo_delete_many(col, {'r_type': RType['similarBook']})
            mongoDbConnector.mongo_save_many(col, result)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            mongoDbConnector.mongo_disconnect()
    
    def get_recommendation(self, N=5):
        self.load_book_data()
        self.load_story_data()
        result = self.get_hybrid_similarity(N=N) 
        self.save_data(result)
        return result[:10]
