package com.palja.audisay.domain.book.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LastBookInfo {
	private Long lastBookId; // 마지막 조회한 도서 bookId
	private LocalDateTime lastCreatedAt; // 마지막 조회한 도서 등록 일시
}
