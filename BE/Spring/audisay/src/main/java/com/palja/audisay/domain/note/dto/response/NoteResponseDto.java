package com.palja.audisay.domain.note.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoteResponseDto {
	private Long noteId;
	private Long bookId;
	private String title;
	private Double progressRate;
	private String createdAt;
	private String sentence;
	private String sentenceId;
}
