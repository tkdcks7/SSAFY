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

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notes")
public class NoteController {
	private final NoteService noteService;

	@GetMapping()
	public ResponseEntity<NoteResponseDto> findByMember() {
		long memberId = 1L;
		NoteResponseDto noteResponseDto = noteService.findNotesByMember(memberId);
		return new ResponseEntity<>(noteResponseDto, HttpStatus.OK);
	}

	@GetMapping("/{bookId}")
	public ResponseEntity<NoteResponseDto> findByMemberAndBook(@PathVariable Long bookId) {
		long memberId = 1L;
		NoteResponseDto noteResponseDto = noteService.findNotesByMemberAndBook(memberId, bookId);
		return new ResponseEntity<>(noteResponseDto, HttpStatus.OK);
	}

	@PostMapping()
	public ResponseEntity<?> saveNote(@RequestBody NoteRequestDto noteRequestDto) {
		long memberId = 1L;
		boolean f = noteService.saveNote(memberId, noteRequestDto);
		if (!f) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/{noteId}")
	public ResponseEntity<?> deleteByNoteId(@PathVariable Long noteId) {
		long memberId = 1L;
		noteService.deleteNoteByNoteId(memberId, noteId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
