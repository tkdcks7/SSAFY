package com.palja.audisay.domain.book.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.book.dto.response.PublishedBookDownloadInfoDto;
import com.palja.audisay.domain.book.service.BookDownloadService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/published-books")
@Tag(name = "출판 도서 - 다운로드", description = "출판 도서 다운로드 API")
public class BookDownloadController {
	private final BookDownloadService bookDownloadService;

	@Operation(summary = "도서 다운로드",
		description = "출판 도서(bookId)의 다운로드 링크 및 메타데이터 반환")
	@Parameters({
		@Parameter(name = "bookId", description = "도서 식별 번호", required = true, example = "1")
	})
	@GetMapping("/{bookId}/download")
	public ResponseEntity<PublishedBookDownloadInfoDto> downloadPublishedBook(@PathVariable("bookId") Long bookId) {
		return new ResponseEntity<>(bookDownloadService.downloadPublishedBook(bookId), HttpStatus.OK);
	}
}
