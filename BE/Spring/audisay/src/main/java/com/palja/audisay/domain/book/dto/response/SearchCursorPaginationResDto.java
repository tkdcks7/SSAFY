package com.palja.audisay.domain.book.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchCursorPaginationResDto {
	private String keyword;
	private List<PublishedBookInfoDto> bookList;
	private String lastSearchId;
}
