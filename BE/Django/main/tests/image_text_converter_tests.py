import unittest
from main.services.image_text_converter import ImageToTextConverter

class TestImageTextConverter(unittest.TestCase):
    def setUp(self):
        self.converter = ImageToTextConverter()

    def test_quotation_mark_validator(self):
        texts = ['"고맙네, 에드워드 350B11.']
        validated_texts = self.converter.quotation_mark_validator(texts)
        
        for text in validated_texts:
            print(text)