import unittest
from main.services.initial_ebook_converter import InitialEbookConverter
import io
from config.settings.base import STATIC_ROOT
import os

class TestInitialEbookConverter(unittest.TestCase):
    def setUp(self):
        self.static_path = STATIC_ROOT
        self.converter = InitialEbookConverter()

    def test_ebook_converter(self):
        with open(os.path.join(self.static_path, 'illust.jpg'), 'rb') as illust_file:
            illust_data = io.BytesIO(illust_file.read())
        with open(os.path.join(self.static_path, 'cover.jpg'), 'rb') as cover_file:
            cover_data = io.BytesIO(cover_file.read())
        
        data = {
                'metadata': {
                        'title': '백설의 공포', 
                        'author': '폭스 B. 홀덴', 
                        'cover': cover_data, 
                        'created_at': '2024-10-30T12:00:00Z', 
                        'category_id': '000'
                }, 
                'pages': [
                        {
                                'page_number': 1, 
                                'layout': 'text_only', 
                                'sections': [
                                        {
                                                'type': 'title', 
                                                'sequence': 0, 
                                                'content': {
                                                        'texts': ['크게 된 눈사람']
                                                }
                                        }, 
                                        {
                                                'type': 'text', 
                                                'sequence': 1, 
                                                'content': {
                                                        'texts': [
                                                                '네이슨 교수의 집 현관에 나온 사람은 15, 6세 되어 보이는 소녀였다.', 
                                                                '페인트칠을 하다가 나 왔는지, 페인트가 마구 묻은 허름한 옷을 입고 있었다.', 
                                                                '그러나 보기에는 영리한 듯하고 깨끗한 느낌의 소녀였다.', 
                                                                '데이비드가 이름을 대자, 소녀는 상냥하게 말했다.', 
                                                                '"저는 카렌이라고 해요.', 
                                                                '어서 들어오셔요.', 
                                                                '곧 아버지를 모셔 오겠어요."'
                                                        ]
                                                }
                                        }
                                ]
                        }, 
                        {
                                'page_number': 2, 
                                'layout': 'image_only', 
                                'sections': [
                                        {
                                                'type': 'image', 
                                                'sequence': 0, 
                                                'content': {
                                                        'image': illust_data
                                                }
                                        }
                                ]
                        }
                ]
                }

        result = self.converter.make_book(data)
        print(result)