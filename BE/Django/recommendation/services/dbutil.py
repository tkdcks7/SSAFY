from pymongo import MongoClient
import pymysql
from django.conf import settings

## ------------------ mongoDB 
class MongoDBConnector:
    def __init__(self) -> None:
        self.client = None

    def mongo_connect(self):
        mongo_uri = settings.DATABASE_MONGO 
        self.client = MongoClient(mongo_uri)

    def mongo_disconnect(self):
        self.client.close()

    def mongo_get_collection(self, db_name, col_name):
        db = self.client["audisay"]
        collection = db[db_name+"_"+col_name]

        return collection

    def read_data_from_collection(self, collection, query):
        try:
            result = collection.find(query)
            return list(result) 
        except Exception as e:
            print(f"read_data_from_collection Error: {e}")
            return None

    def mongo_save(self, collection, data):
        result = collection.insert_one(data)

    def mongo_save_many(self, collection, data):
        result = collection.insert_many(data)

    def mongo_update_one(self, collection, filter, data):
        result = collection.update_one(filter, {'$set': data}, upsert=True) 

    def mongo_delete_many(self, collection, filter):
        collection.delete_many(filter)

    def mongo_save_with_delete(self, collection, data):
        self.mongo_delete_many(collection, {})
        self.mongo_save_many(collection, data)

    def mongo_save_with_update(self, collection, data):
        for item in data:
            self.mongo_update_one(collection, {'theme_id': item['theme_id']}, 
                            {'similar_themes': item['similar_themes'], 'similar_themes_sim': item['similar_themes_sim']})

    def get_next_sequence(self, name):
        counter = self.client["audisay"].counters.find_one_and_update(
            {"_id": name},
            {"$inc": {"sequence_value": 1}},
            upsert=True,
            return_document=True
        )
        return counter["sequence_value"]

## -------------- mysql 

class MysqlConnector:
    def __init__(self):
        self.connection = None 

    def mysql_connect(self):
        self.connection = pymysql.connect(
            host= settings.DATABASES['default']['HOST'],
            port=int(settings.DATABASES['default']['PORT']),
            user=settings.DATABASES['default']['USER'],
            password=settings.DATABASES['default']['PASSWORD'],
            database=settings.DATABASES['default']['NAME'],
            cursorclass=pymysql.cursors.DictCursor
        )

        return self.connection 
        
    def mysql_disconnect(self):
        self.connection.close() 


    def mysql_read_all(self, query):
        with self.connection.cursor() as cursor:
            sql_query = query
            cursor.execute(sql_query)
            results = cursor.fetchall()

            return results
