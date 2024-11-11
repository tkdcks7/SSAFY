package com.palja.audisay.domain.book.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.book.dto.request.SearchPaginationReqDto;
import com.palja.audisay.domain.book.dto.response.PublishedBookInfoDto;
import com.palja.audisay.domain.book.dto.response.SearchCursorPaginationResDto;
import com.palja.audisay.domain.book.service.BookService;
import com.palja.audisay.global.util.SessionUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/published-books")
@Tag(name = "출판 도서 조회", description = "출판 도서 검색 목록 / 상세 정보 관련 API")
public class BookController {

	private final BookService bookService;

	@Operation(summary = "도서 상세 내용 조회",
		description = "도서(bookId)의 상세 내용**(제목, 표지, 표지설명, 저자, 출판사, 카테고리(장르), 출판년도, 줄거리, ISBN, 자체TTS여부, 리뷰평점, 사용자 담은/좋아요 여부)** 반환")
	@Parameters({
		@Parameter(name = "bookId", description = "도서 식별 번호", required = true, example = "1")
	})
	@GetMapping("/{bookId}")
	public ResponseEntity<PublishedBookInfoDto> getPublishedBookDetail(@PathVariable("bookId") Long bookId) {
		Long memberId = SessionUtil.getMemberId();
		return new ResponseEntity<>(bookService.findPublishedBookDetail(memberId, bookId), HttpStatus.OK);
	}

	@Operation(summary = "도서 검색 및 전체 목록 조회", description = "검색어(keyword) 입력 시 제목, 저자, 출판사와 일치하는 도서 검색")
	@Parameters({
		@Parameter(name = "keyword", description = "검색어"),
		@Parameter(name = "lastSearchId", description = "마지막 조회한 도서의 searchId"),
		@Parameter(name = "sortBy", description = "정렬 항목 (published_date, title)", example = "published_date"),
		@Parameter(name = "sortOrder", description = "정렬 방향 (asc, desc)", example = "acs"),
		@Parameter(name = "pageSize", description = "페이지 크기(기본값 10)")
	})
	@GetMapping
	public ResponseEntity<SearchCursorPaginationResDto> getSearchPublishedBookResult(
		@Schema(hidden = true) @Valid @ModelAttribute SearchPaginationReqDto searchPaginationReqDto) {
		return new ResponseEntity<>(bookService.getSearchPublishedBookResult(searchPaginationReqDto),
			HttpStatus.OK);
	}

}
