package com.palja.audisay.domain.book.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * 커서 기반 페이지네이션에 사용될 cursorId 와 page size.
 */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class CursorPaginationReqDto {
	private LocalDateTime lastDateTime;    // 커서로 사용할 마지막 생성 시간
	private Long lastId;                // 마지막 식별 번호 or 같은 시간에 생성된 경우를 위한 보조 커서
	private String lastSearchId;        // 마지막 검색 결과의 식별번호
	@Min(1)
	@Builder.Default
	private Integer pageSize = 10;
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize == null ? 10 : pageSize;
	}
}
