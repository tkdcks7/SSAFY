package com.palja.audisay.domain.book.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.entity.Dtype;
import com.palja.audisay.global.util.StringUtil;

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

	public static PublishedBookDownloadInfoDto toDto(Book book) {
		return PublishedBookDownloadInfoDto.builder()
			.bookId(book.getBookId())
			.title(book.getTitle())
			.cover(book.getCover())
			.coverAlt(book.getCoverAlt())
			.author(book.getAuthor())
			.publisher(book.getPublisher())
			.publishedAt(StringUtil.dateToString(book.getPublishedDate()))
			.story(book.getStory())
			.isbn(book.getIsbn())
			.dtype(book.getDtype())
			.myTtsFlag(book.getMyTtsFlag())
			.category(book.getCategory().getCategoryName())
			.build();
	}
}
