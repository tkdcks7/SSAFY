package com.palja.audisay.domain.book.dto;

import java.time.LocalDateTime;

public record LastBookInfo(
	Long lastBookId,
	LocalDateTime lastCreatedAt
) {
	// 기본 생성자는 만들어지지 않아 작성
	public LastBookInfo() {
		this(null, null);
	}
}
