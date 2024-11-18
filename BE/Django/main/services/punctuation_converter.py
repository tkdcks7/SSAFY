from ebooklib import epub
from typing import List, Dict 
import asyncio 
import logging 

## -------------- 
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
        openai.set_sync_client()
        processed_sentence_list = openai.correct_punctuation(sentence_list)

        # 3. 교정된 문장 다시 epub에 적용 
        fixed_book = EpubReader.set_sentence_text_with_index(book, processed_sentence_list)

        return fixed_book 

    @staticmethod
    async def fix_punctuation_by_list(input_data: List[Dict]):
        # 1. 페이지 별로 비동기 요청을 보낸다 
        # asyncio는 이벤트 루프 기반 (반복문 속 작업을 하나씩 실행, 실행한 작업이 응답을 기다린다면 다른 작업에게 권한 넘김)
        # task를 하나하나 등록해도 되지만, gather로 한번에 등록 가능  
        task_list = [PunctuationConverter.process_pages(page) for page in input_data['pages']]
        input_data['pages'] = await asyncio.gather(*task_list)
        # 모든 작업 완료되면 반환 
        return input_data 

    
    @staticmethod
    async def process_pages(page):
        # 2. 페이지 단위로, 여러 개의 섹션을 한번의 요청에 보낸다 
        sections = page["sections"]
        # section 데이터에서 sequence와 text만 추출
        data_list = [
            {"sequence": i, "text": section["content"]}
            for i, section in enumerate(sections) if section.get("type") == "text" and "content" in section 
        ]
        sequences, corrected_texts = await PunctuationConverter.process_sections(data_list)

        ## 페이지 단위로 보냈기 때문에, sequence에 따라 변환 데이터 삽입 가능
        # 순서대로 seq 삽입했으므로 인덱스로 접근해도 괜찮은가... 
        for sequence, corrected_text in zip(sequences, corrected_texts):
            sections[sequence]['content'] = corrected_text

        return page
    
    @staticmethod
    async def process_sections(data_list):
        # 3. 핵심 정보만 추출된 리스트를 openAI로 전송해 띄어쓰기 교정
        openai = OpenAIAnalysis()
        openai.set_async_client()
        # logging.info(f"변환 전 {[item["text"] for item in data_list]}")
        processed_sentence_list = await openai.correct_punctuation_async(data_list)
        # logging.info(f"변환 후 {[item["text"] for item in processed_sentence_list]}")

        # 결과 반환 
        sequences = [item["sequence"] for item in data_list]
        # corrected_texts = [item["text"] for item in processed_sentence_list]
        corrected_texts = []
        for item in processed_sentence_list:
            if isinstance(item, dict) and "text" in item:
                corrected_texts.append(item["text"])
            else:
                logging.info(f"Item skipped: {item}")
        return sequences, corrected_texts