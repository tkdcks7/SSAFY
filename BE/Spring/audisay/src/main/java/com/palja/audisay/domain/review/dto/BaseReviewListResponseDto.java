package com.palja.audisay.domain.review.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@SuperBuilder // Lombok의 @SuperBuilder를 사용하여 상속받은 클래스에서도 빌더 패턴 사용
public class BaseReviewListResponseDto {
	private List<ReviewResponseDto> reviewList;
	private LocalDateTime lastUpdatedAt;
	private Long lastReviewId;
}
