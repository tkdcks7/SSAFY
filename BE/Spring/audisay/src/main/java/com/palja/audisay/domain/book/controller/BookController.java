package com.palja.audisay.domain.book.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.book.service.BookService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/published-books")
@Tag(name = "출판 도서", description = "출판 도서 검색 목록 / 상세 내용 조회 API")
public class BookController {

	private final BookService bookService;

	@Operation(summary = "도서 상세 내용 조회", description = "bookId의 상세 내용() 반환")
	@Parameters({
		@Parameter(name = "bookId", description = "도서 식별 번호", required = true, example = "1")
	})
	@GetMapping("/{bookId}")
	public ResponseEntity<?> getPublishedBookDetail(@PathVariable("bookId") Long bookId) {
		return new ResponseEntity<>(bookService.getPublishedBookDetail(bookId), HttpStatus.OK);
	}

}
