package com.palja.audisay.domain.book.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.palja.audisay.domain.book.entity.Dtype;

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
	private String category;
	private String coverAlt;
	private String author;
	private String publisher;
	private LocalDate publishedAt;
	private String story;
	private String isbn;
	private Boolean myTtsFlag;
	private Dtype dtype;
	private ReviewDistribution reviewDistribution;
	private MemberInfo memberInfo;

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class ReviewDistribution {
		private Float average;
		@JsonProperty("5")
		private Float five;
		@JsonProperty("4")
		private Float four;
		@JsonProperty("3")
		private Float three;
		@JsonProperty("2")
		private Float two;
		@JsonProperty("1")
		private Float one;
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
