package com.palja.audisay.domain.note.dto.request;

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
	private Long bookId;
	private Double progressRate;
	private String sentenceId;
	private String sentence;
}
