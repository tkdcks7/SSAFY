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
				Double.parseDouble(values[0]),     // score
				sortBy.equals("publishedDate") ? Long.parseLong(values[1]) : values[1],         // date (timestamp)
				Long.parseLong(values[2])          // bookId
				Double.parseDouble(decodedValues[0]),     // score
				Long.parseLong(decodedValues[2])          // bookId
			));
		} catch (Exception e) {
			log.error("SearchAfterValues parse error = {}", e.getMessage());
			return null;
		}
	}

	public static String generateNextSearchId(SearchHit<BookIndex> lastHit) {
		if (lastHit == null) {
			return null;
		}

		List<Object> sortValues = List.of(lastHit.getSortValues().toArray(new Object[0]));
		if (sortValues.size() < 3) {
			return null;
		}

		// 정렬값들을 comma로 구분하고 Base64 인코딩
		String searchAfterString = String.format("%s-%s-%s",
			sortValues.get(0),    // score
			sortValues.get(1),    // date
			sortValues.get(2)     // bookId
		);
		// URL 에선 + 가 공백으로 인식되어 URL-safe Base64 인코딩/디코딩 적용
		return Base64.getUrlEncoder().encodeToString(searchAfterString.getBytes());
	}
}
