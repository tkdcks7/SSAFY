package com.palja.audisay.domain.book.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.book.dto.PublishedBookInfoDto;
import com.palja.audisay.domain.book.service.BookService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/published-books")
@Tag(name = "출판 도서 조회", description = "출판 도서 검색 목록 / 상세 정보 관련 API")
public class BookController {

	private final BookService bookService;
	// 임시 memberId
	private final Long tempMemberId = 1L;

	@Operation(summary = "도서 상세 내용 조회",
		description = "도서(bookId)의 상세 내용**(제목, 표지, 표지설명, 저자, 출판사, 카테고리(장르), 출판년도, 줄거리, ISBN, 자체TTS여부, 리뷰평점, 사용자 담은/좋아요 여부)** 반환")
	@Parameters({
		@Parameter(name = "bookId", description = "도서 식별 번호", required = true, example = "1")
	})
	@GetMapping("/{bookId}")
	public ResponseEntity<PublishedBookInfoDto> getPublishedBookDetail(@PathVariable("bookId") Long bookId) {
		return new ResponseEntity<>(bookService.findPublishedBookDetail(tempMemberId, bookId), HttpStatus.OK);
	}

}
