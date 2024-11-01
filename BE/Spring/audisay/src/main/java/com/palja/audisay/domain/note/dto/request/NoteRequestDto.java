package com.palja.audisay.domain.note.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NoteRequestDto {
	// TODO: validation
	@Schema(description = "책 ID", example = "1", defaultValue = "1")
	private Long bookId;
	@Schema(description = "진행률", example = "50.2", defaultValue = "50.2")
	private Double progressRate;
	@Schema(description = "문장 ID", example = "1", defaultValue = "1")
	private String sentenceId;
	@Schema(description = "문장", example = "문장 입력", defaultValue = "예시 문장입니다.")
	private String sentence;
}
