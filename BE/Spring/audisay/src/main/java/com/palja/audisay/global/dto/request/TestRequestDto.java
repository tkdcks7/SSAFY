package com.palja.audisay.global.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class TestRequestDto {
	@Schema(description = "메시지", example = "안녕하세요", defaultValue = "안녕하세요")
	private String message;
	@Schema(description = "숫자", example = "1", defaultValue = "1")
	private Integer number;
}
