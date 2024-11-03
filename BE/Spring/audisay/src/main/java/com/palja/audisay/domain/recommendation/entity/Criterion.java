package com.palja.audisay.domain.recommendation.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Criterion {
	FAMOUS_BOOK("인기 도서"),
	DEMOGRAPHICS_BOOK("%s 인기 도서"),
	CATEGORY_BOOK("%s 카테고리 인기 도서"),
	SIMILAR_BOOK("최근 본 %s와/과 유사한 도서"),
	SIMILAR_MEMBER_BOOK("나와 비슷한 사용자가 좋아한 도서");

	private final String template;

	public String format() {
		return String.format(template, "");
	}

	public String format(String dynamicPart) {
		return String.format(template, dynamicPart);
	}
}
