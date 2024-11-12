package com.palja.audisay.domain.book.dto.response;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.palja.audisay.domain.book.entity.DType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 출판 도서 정보 Dto
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class PublishedBookInfoDto {
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
	private DType dType;
	private Boolean myTtsFlag;
	private ReviewDistribution reviewDistribution;
	private MemberInfo memberInfo;
	private Boolean epubFlag;
	@JsonIgnore
	private LocalDate publishedDate;
	@JsonIgnore
	private String coverRaw;

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	@JsonInclude(JsonInclude.Include.NON_NULL)
	public static class ReviewDistribution {
		private Double average;
		@JsonProperty("5")
		private Double five;
		@JsonProperty("4")
		private Double four;
		@JsonProperty("3")
		private Double three;
		@JsonProperty("2")
		private Double two;
		@JsonProperty("1")
		private Double one;
		private Long totalCount;
	}

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class MemberInfo {
		private Boolean cartFlag;
		private Boolean likedFlag;
	}
}
