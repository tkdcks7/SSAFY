package com.palja.audisay.domain.book.dto;

import java.util.Map;

import org.springframework.data.domain.Sort;

public record SearchSort(
	String sortBy,
	Sort.Direction sortOrder
) {
	// 정적 필드명을 매핑하는 맵
	private static final Map<String, String> FIELD_MAP = Map.of(
		"published_date", "publishedDate",
		"title", "title.keyword"
	);

	public static SearchSort setSort(String sortBy, String sortOrder) {
		// sortBy에 대한 유효성 검사 및 변환
		String dbField = FIELD_MAP.getOrDefault(sortBy.toLowerCase(), "_score");
		if (dbField.equals("_score")) {
			return new SearchSort("_score", Sort.Direction.DESC);
		}

		// sortOrder 문자열에 따라 방향 설정 (기본값: DESC)
		Sort.Direction direction = "asc".equalsIgnoreCase(sortOrder)
			? Sort.Direction.ASC
			: Sort.Direction.DESC;
		return new SearchSort(dbField, direction);
	}
}
