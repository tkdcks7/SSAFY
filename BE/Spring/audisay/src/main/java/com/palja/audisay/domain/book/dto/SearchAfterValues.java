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

	public static SearchAfterValues parse(String sortBy, String searchId) {
		if (searchId == null || searchId.isEmpty()) {
			return null;
		}

		try {
			// searchId는 "score,date,id" 형태의 Base64 인코딩된 문자열
			String decoded = new String(Base64.getUrlDecoder().decode(searchId));
			String[] decodedValues = decoded.split("~\\|");
			return new SearchAfterValues(List.of(
				Double.parseDouble(decodedValues[0]),     // score
				parseUserSortByValue(sortBy, decodedValues[1]), // date (timestamp) or text(String)
				Long.parseLong(decodedValues[2])          // bookId
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
		if (lastHit == null || lastHit.getSortValues().size() < 3) {
			return null;
		}
		// 정렬값들을 comma로 구분하고 Base64 인코딩
		String searchAfterString = String.format("%s~|%s~|%s",
			lastHit.getSortValues().get(0),    // score
			lastHit.getSortValues().get(1),    // date
			lastHit.getSortValues().get(2)    // bookId
		);
		// URL 에선 + 가 공백으로 인식되어 URL-safe Base64 인코딩/디코딩 적용
		return Base64.getUrlEncoder().encodeToString(searchAfterString.getBytes());
	}
}
