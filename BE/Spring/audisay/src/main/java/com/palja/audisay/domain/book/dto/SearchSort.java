package com.palja.audisay.domain.book.dto;

import org.springframework.data.domain.Sort;

public record SearchSort(
	String sortBy,
	Sort.Direction sortOrder
) {
	public static SearchSort setSort(String sortBy, String sortOrder) {
		Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder)
			? Sort.Direction.DESC
			: Sort.Direction.ASC;

		// 필드명 변환 (published_date -> publishedDate)
		String dbField = sortBy.equals("published_date") ? "publishedDate" : "title.keyword";
		return new SearchSort(dbField, direction);
	}
}
