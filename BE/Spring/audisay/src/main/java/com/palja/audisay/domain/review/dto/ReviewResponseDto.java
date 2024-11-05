package com.palja.audisay.domain.review.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.palja.audisay.domain.review.entity.Review;
import com.palja.audisay.global.util.StringUtil;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewResponseDto {
	private Long reviewId;
	private Long bookId;
	private String nickname; // 다른 사용자 리뷰의 닉네임
	private String title;
	private int score;
	private String content;
	private String updatedAt;

	public static ReviewResponseDto toDto(Review review) {
		return ReviewResponseDto.builder()
			.reviewId(review.getReviewId())
			.bookId(review.getBook().getBookId())
			.title(review.getBook().getTitle())
			.score(review.getScore())
			.content(review.getContent())
			.updatedAt(StringUtil.datetimeToString(review.getUpdatedAt()))
			.build();
	}

	public static ReviewResponseDto toMemberReviewDto(Review review) {
		return ReviewResponseDto.builder()
			.reviewId(review.getReviewId())
			.content(review.getContent())
			.score(review.getScore())
			.updatedAt(StringUtil.datetimeToString(review.getUpdatedAt()))
			.build();
	}

	public static ReviewResponseDto toReviewListDto(Review review) {
		return ReviewResponseDto.builder()
			.reviewId(review.getReviewId())
			.nickname(review.getMember().getNickname()) // 닉네임 포함
			.content(review.getContent())
			.score(review.getScore())
			.updatedAt(StringUtil.datetimeToString(review.getUpdatedAt()))
			.build();
	}
}
