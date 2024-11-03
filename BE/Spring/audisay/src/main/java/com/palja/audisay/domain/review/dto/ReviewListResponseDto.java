package com.palja.audisay.domain.review.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class ReviewListResponseDto extends BaseReviewListResponseDto {
	private ReviewResponseDto memberReview; // 본인의 리뷰
}
