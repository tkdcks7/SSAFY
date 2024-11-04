package com.palja.audisay.domain.book.dto.respose;

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
public class BookSearchResDto {
	private String keyword;
	private List<PublishedBookInfoDto> bookList;
	private LocalDateTime lastCreatedAt;
	private Long lastBookId;

}
