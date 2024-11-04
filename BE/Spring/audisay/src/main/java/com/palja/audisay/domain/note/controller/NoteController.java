package com.palja.audisay.domain.note.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.note.dto.request.NoteRequestDto;
import com.palja.audisay.domain.note.dto.response.NoteResponseDto;
import com.palja.audisay.domain.note.service.NoteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notes")
@Tag(name = "독서노트", description = "독서노트 CRUD API")
public class NoteController {
	private final NoteService noteService;

	@GetMapping()
	@Operation(summary = "독서노트 조회", description = "멤버ID로 독서노트 조회")
	public ResponseEntity<NoteResponseDto> findByMember() {
		long memberId = 1L;
		NoteResponseDto noteResponseDto = noteService.findNotesByMember(memberId);
		return new ResponseEntity<>(noteResponseDto, HttpStatus.OK);
	}

	@GetMapping("/{bookId}")
	@Operation(summary = "독서노트 조회(뷰어)", description = "멤버ID와 책ID로 독서노트 조회. 뷰어 표시용")
	@Parameters({
		@Parameter(name = "bookId", description = "책 ID (기본값: 1)", example = "1")
	})
	public ResponseEntity<NoteResponseDto> findByMemberAndBook(@PathVariable Long bookId) {
		long memberId = 1L;
		NoteResponseDto noteResponseDto = noteService.findNotesByMemberAndBook(memberId, bookId);
		return new ResponseEntity<>(noteResponseDto, HttpStatus.OK);
	}

	@PostMapping()
	@Operation(summary = "독서노트 생성", description = "독서노트 생성")
	public ResponseEntity<?> saveNote(@RequestBody NoteRequestDto noteRequestDto) {
		long memberId = 1L;
		boolean f = noteService.saveNote(memberId, noteRequestDto);
		if (!f) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/{noteId}")
	@Operation(summary = "독서노트 삭제", description = "노트ID로 독서노트 삭제")
	@Parameters({
		@Parameter(name = "noteId", description = "노트 ID (기본값: 1)", example = "1")
	})
	public ResponseEntity<?> deleteByNoteId(@PathVariable Long noteId) {
		long memberId = 1L;
		noteService.deleteNoteByNoteId(memberId, noteId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
