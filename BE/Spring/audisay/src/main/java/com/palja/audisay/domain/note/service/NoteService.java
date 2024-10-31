package com.palja.audisay.domain.note.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.note.dto.response.NoteResponseDto;
import com.palja.audisay.domain.note.entity.Note;
import com.palja.audisay.domain.note.repository.NoteRepository;
import com.palja.audisay.global.exception.exceptions.NoteNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoteService {

	private final NoteRepository noteRepository;

	public NoteResponseDto findNotesByMember(Long memberId) {
		List<Note> noteList = noteRepository.findAllByMemberIdWithBook(memberId);
		return NoteResponseDto.builder()
			.noteList(noteList.stream().map(NoteResponseDto.NoteComponentDto::toDto).toList())
			.build();
	}

	public NoteResponseDto findNotesByMemberAndBook(Long memberId, Long bookId) {
		List<Note> noteList = noteRepository.findAllByMemberMemberIdAndBookBookIdOrderByCreatedAt(memberId, bookId);
		return NoteResponseDto.builder()
			.noteList(noteList.stream().map(NoteResponseDto.NoteComponentDto::toDtoForViewer).toList())
			.build();
	}

	@Transactional
	public void deleteNoteByNoteId(Long memberId, Long noteId) {
		int deletedCount = noteRepository.deleteByNoteIdAndMemberMemberId(noteId, memberId);
		if (deletedCount == 0) {
			throw new NoteNotFoundException();
		}
	}
}
