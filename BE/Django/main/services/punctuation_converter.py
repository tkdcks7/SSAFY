from ebooklib import epub
from main.services.epub_reader import EpubReader
from main.services.image_caption_util import OpenAIAnalysis

class PunctuationConverter:
    @staticmethod
    def fix_punctuation(book: epub):
        ## 로직
        # 1. span 태그를 추출하여 리스트로 반환
        sentence_list = EpubReader.get_sentence_with_index(book)

        # 2. 해당 리스트를 openAI로 전송해 띄어쓰기 교정
        openai = OpenAIAnalysis()
        processed_sentence_list = openai.correct_punctuation(sentence_list)

        # 3. 교정된 문장 다시 epub에 적용 
        fixed_book = EpubReader.set_sentence_text_with_index(book, processed_sentence_list)

        return fixed_book 
