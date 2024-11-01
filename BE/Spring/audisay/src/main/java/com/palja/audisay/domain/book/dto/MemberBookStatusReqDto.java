package com.palja.audisay.domain.book.dto;

import com.fasterxml.jackson.annotation.JsonView;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자의 도서 상태(좋아요 여부 / 담은 여부) 변경 요청 DTO.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberBookStatusReqDto {
	@NotNull
	@Schema(description = "도서 식별 번호", example = "1", defaultValue = "1")
	private Long bookId;
	@Schema(description = "좋아요 여부", example = "true", defaultValue = "true")
	@JsonView(LikeView.class)
	private Boolean likedFlag;
	@Schema(description = "담은 도서 ", example = "true", defaultValue = "true")
	@JsonView(CartView.class)
	private Boolean cartFlag;
	public interface LikeView {
	}
	public interface CartView {
	}

}
