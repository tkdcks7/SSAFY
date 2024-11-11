package com.palja.audisay.domain.book.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class SearchPaginationReqDto extends CursorPaginationReqDto {
	private String keyword;
	private String lastSearchId;
	@Builder.Default
	private String sortBy = "published_date";
	@Builder.Default
	private String sortOrder = "asc";
}
