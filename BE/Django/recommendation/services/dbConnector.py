from pymongo import MongoClient
import pymysql
from django.conf import settings

## ------------------ mongoDB 
class MongoDBConnector:
    def mongo_connect():
        mongo_uri = settings.DATABASE_MONGO 
        client = MongoClient(mongo_uri)
        return client 

    def mongo_disconnect(client):
        client.close()

    def mongo_get_collection(client, db_name, col_name):
        db = client["audisay"]
        collection = db[db_name+"_"+col_name]

        return collection

    def read_data_from_collection(collection, query):
        try:
            result = collection.find(query)
            return list(result) 
        except Exception as e:
            print(f"read_data_from_collection Error: {e}")
            return None

    def mongo_save_many(collection, data):
        result = collection.insert_many(data)

    def mongo_update_one(collection, filter, data):
        result = collection.update_one(filter, {'$set': data}, upsert=True) 

    def mongo_delete_many(collection, filter):
        collection.delete_many(filter)

    def mongo_save_with_delete(self, collection, data):
        self.mongo_delete_many(collection, {})
        self.mongo_save_many(collection, data)

    def mongo_save_with_update(self, collection, data):
        for item in data:
            self.mongo_update_one(collection, {'theme_id': item['theme_id']}, 
                            {'similar_themes': item['similar_themes'], 'similar_themes_sim': item['similar_themes_sim']})


## -------------- mysql 

class MysqlConnector:
    def mysql_connect():
        print(settings.DATABASES)
        connection = pymysql.connect(
            host= settings.DATABASES['default']['HOST'],
            port=int(settings.DATABASES['default']['PORT']),
            user=settings.DATABASES['default']['USER'],
            password=settings.DATABASES['default']['PASSWORD'],
            database=settings.DATABASES['default']['NAME'],
            cursorclass=pymysql.cursors.DictCursor
        )

        return connection 
        
    def mysql_disconnect(connection):
        connection.close() 


    def mysql_read_all(connection, query):
        with connection.cursor() as cursor:
            sql_query = query
            cursor.execute(sql_query)
            results = cursor.fetchall()

            return results
