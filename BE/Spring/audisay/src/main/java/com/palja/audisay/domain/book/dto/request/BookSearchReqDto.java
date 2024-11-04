package com.palja.audisay.domain.book.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookSearchReqDto {
	private String keyword;
	private LocalDateTime lastCreatedAt;  // 커서로 사용할 마지막 생성 시간
	private Long lastBookId;              // 같은 시간에 생성된 경우를 위한 보조 커서
	@Min(1)
	@Builder.Default
	private Integer pageSize = 10;
}
