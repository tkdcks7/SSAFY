package com.palja.audisay.domain.recommendation.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Criterion {
	FAMOUS_BOOK("인기 도서", "famous"),
	DEMOGRAPHICS_BOOK("%s 인기 도서", "demographics"),
	CATEGORY_BOOK("%s 카테고리 인기 도서", "category"),
	SIMILAR_BOOK("최근 본 %s와/과 비슷한 도서", "similarBook"),
	SIMILAR_MEMBER_BOOK("나와 비슷한 사용자가 좋아한 도서", "similarMember"),
	SIMILAR_BOOK_BY_CONTEXT("이 도서와 비슷한 도서", "similarBook"),
	SIMILAR_BOOK_BY_LIKES("이 도서를 좋아한 사용자들이 좋아한 도서", "similarLikesBook");

	private final String template;
	private final String type;

	public String format() {
		return String.format(template, "");
	}

	public String format(String dynamicPart) {
		return String.format(template, dynamicPart);
	}
}
