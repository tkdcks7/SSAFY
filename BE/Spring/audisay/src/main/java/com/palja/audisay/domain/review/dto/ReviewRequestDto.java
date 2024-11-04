package com.palja.audisay.domain.review.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonView;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.review.entity.Review;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewRequestDto {

	@JsonView(CreateView.class)
	@NotNull(groups = CreateView.class)  // 등록 시 필수
	@Null(groups = UpdateView.class)     // 수정 시 제외
	@Schema(description = "책 ID", example = "1", defaultValue = "1")
	private Long bookId;

	@JsonView({CreateView.class, UpdateView.class})
	@NotNull(groups = CreateView.class) // 등록 시 필수
	@Min(1)
	@Max(5)
	@Schema(description = "별점", example = "3", defaultValue = "3")
	private Integer score;

	@JsonView({CreateView.class, UpdateView.class})
	@NotNull(groups = CreateView.class) // 등록 시 필수
	@Size(max = 500)
	@Schema(description = "리뷰 내용", example = "리뷰 예시입니다.", defaultValue = "리뷰 예시입니다.")
	private String content;

	// DTO -> Review 엔티티 변환 메서드
	public Review toEntity(Member member, Book book) {
		return Review.builder()
			.member(member)
			.book(book)
			.score(this.score.byteValue())
			.content(this.content)
			.build();
	}

	public interface CreateView {
	}

	public interface UpdateView {
	}
}
