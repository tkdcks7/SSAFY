package com.palja.audisay.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class SearchCursorPaginationResDto extends BookCursorPaginationResDto {
	private String keyword;
	private String lastSearchId;
}
