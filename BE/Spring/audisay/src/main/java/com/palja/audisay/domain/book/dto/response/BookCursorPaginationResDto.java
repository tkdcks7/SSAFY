package com.palja.audisay.domain.book.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookCursorPaginationResDto {
	private List<PublishedBookInfoDto> bookList;
	private LocalDateTime lastDateTime;
	private Long lastId;
}
