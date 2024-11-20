package com.palja.audisay.domain.book.dto;

import java.util.Base64;
import java.util.List;

import org.springframework.data.elasticsearch.core.SearchHit;

import com.palja.audisay.domain.book.entity.BookIndex;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public record SearchAfterValues(
	List<Object> values
) {
	public static final int TOTAL_SORT_CNT = 2;
	public static final int DATA_SORT_IDX = 0;   // date의 인덱스
	public static final int BOOKID_SORT_IDX = 1; // bookId의 인덱스

	public static SearchAfterValues parse(String sortBy, String searchId) {
		if (searchId == null || searchId.isEmpty()) {
			return null;
		}

		try {
			// searchId는 "score,date,id" 형태의 Base64 인코딩된 문자열
			String decoded = new String(Base64.getUrlDecoder().decode(searchId));
			String[] decodedValues = decoded.split("~\\|");
			return new SearchAfterValues(List.of(
				parseUserSortByValue(sortBy, decodedValues[DATA_SORT_IDX]), // date (timestamp) or text(String)
				Long.parseLong(decodedValues[BOOKID_SORT_IDX])          // bookId
			));
		} catch (Exception e) {
			log.error("SearchAfterValues parse error = {}", e.getMessage());
			return null;
		}
	}

	private static Object parseUserSortByValue(String sortBy, String value) {
		// 'publishedDate' 기준으로 timestamp로 변환
		// 'publishedDate' 이 아닌 title.keyword 라면 string으로 반환
		return "_score".equals(sortBy) ? Double.parseDouble(value) :
			"publishedDate".equals(sortBy) ? Long.parseLong(value) :
				value;
	}

	public static String generateNextSearchId(SearchHit<BookIndex> lastHit) {
		if (lastHit == null || lastHit.getSortValues().size() < TOTAL_SORT_CNT) {
			return null;
		}
		// 정렬값들을 comma로 구분하고 Base64 인코딩
		String searchAfterString = String.format("%s~|%s",
			lastHit.getSortValues().getFirst(),    // data
			lastHit.getSortValues().get(BOOKID_SORT_IDX)    // bookId
		);
		// URL 에선 + 가 공백으로 인식되어 URL-safe Base64 인코딩/디코딩 적용
		return Base64.getUrlEncoder().encodeToString(searchAfterString.getBytes());
	}
}
