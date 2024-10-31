package com.palja.audisay.domain.note.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.repository.BookRepository;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.repository.MemberRepository;
import com.palja.audisay.domain.note.dto.request.NoteRequestDto;
import com.palja.audisay.domain.note.dto.response.NoteResponseDto;
import com.palja.audisay.domain.note.entity.Note;
import com.palja.audisay.domain.note.repository.NoteRepository;
import com.palja.audisay.global.exception.exceptions.MemberNotFoundException;
import com.palja.audisay.global.exception.exceptions.NoteInvalidParameterException;
import com.palja.audisay.global.exception.exceptions.NoteNotFoundException;
import com.palja.audisay.global.exception.exceptions.PublishedBookNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoteService {

	private final NoteRepository noteRepository;
	private final MemberRepository memberRepository;
	private final BookRepository bookRepository;

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
	public Boolean saveNote(Long memberId, NoteRequestDto noteRequestDto) {
		// 1. 삽입할 데이터 생성
		Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
		Book book = bookRepository.findById(noteRequestDto.getBookId())
			.orElseThrow(PublishedBookNotFoundException::new);
		LocalDateTime now = LocalDateTime.now();

		// 2. Note Entity 생성 후 삽입
		Note note = Note.builder()
			.book(book)
			.member(member)
			.sentenceId(noteRequestDto.getSentenceId())
			.sentence(noteRequestDto.getSentence())
			.progressRate(noteRequestDto.getProgressRate())
			.createdAt(now)
			.build();

		try {
			noteRepository.save(note);
		} catch (DataIntegrityViolationException e) {
			throw new NoteInvalidParameterException();
		}

		return true;

	}

	@Transactional
	public void deleteNoteByNoteId(Long memberId, Long noteId) {
		int deletedCount = noteRepository.deleteByNoteIdAndMemberMemberId(noteId, memberId);
		if (deletedCount == 0) {
			throw new NoteNotFoundException();
		}
	}
}
