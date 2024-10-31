package com.palja.audisay.domain.note.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.palja.audisay.domain.note.entity.Note;
import com.palja.audisay.global.util.StringUtil;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoteResponseDto {
	private List<NoteComponentDto> noteList;

	@Getter
	@Builder
	@JsonInclude(JsonInclude.Include.NON_NULL)
	public static class NoteComponentDto {
		private Long noteId;
		private Long bookId;
		private String title;
		private Double progressRate;
		private String createdAt;
		private String sentence;
		private String sentenceId;

		public static NoteComponentDto toDto(Note note) {
			return NoteComponentDto.builder()
				.noteId(note.getNoteId())
				.bookId(note.getBook().getBookId())
				.progressRate(note.getProgressRate())
				.createdAt(StringUtil.datetimeToString(note.getCreatedAt()))
				.sentence(note.getSentence())
				.sentenceId(note.getSentenceId())
				.build();
		}

		public static NoteComponentDto toDtoForViewer(Note note) {
			return NoteComponentDto.builder()
				.noteId(note.getNoteId())
				.progressRate(note.getProgressRate())
				.createdAt(StringUtil.datetimeToString(note.getCreatedAt()))
				.sentence(note.getSentence())
				.sentenceId(note.getSentenceId())
				.build();
		}
	}
}
