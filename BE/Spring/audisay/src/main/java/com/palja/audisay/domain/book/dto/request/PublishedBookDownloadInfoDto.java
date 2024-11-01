package com.palja.audisay.domain.book.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.palja.audisay.domain.book.entity.Dtype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class PublishedBookDownloadInfoDto {
	private Long bookId;
	private String title;
	private String cover;
	private String coverAlt;
	private String category;
	private String author;
	private String publisher;
	private String publishedAt;
	private String story;
	private String isbn;
	private Dtype dtype;
	private Boolean myTtsFlag;

	// download
	private String url;
}
