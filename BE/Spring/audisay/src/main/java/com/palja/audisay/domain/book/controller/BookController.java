package com.palja.audisay.domain.book.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;
import com.palja.audisay.domain.book.dto.MemberBookStatusReqDto;
import com.palja.audisay.domain.book.dto.MemberPublishedBookListDto;
import com.palja.audisay.domain.book.dto.PublishedBookInfoDto;
import com.palja.audisay.domain.book.service.BookService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/published-books")
@Tag(name = "출판 도서", description = "출판 도서 검색 목록 / 상세 정보 관련 API")
public class BookController {

	private final BookService bookService;

	@Operation(summary = "도서 상세 내용 조회",
		description = "도서(bookId)의 상세 내용**(제목, 표지, 표지설명, 저자, 출판사, 카테고리(장르), 출판년도, 줄거리, ISBN, 자체TTS여부, 리뷰평점, 사용자 담은/좋아요 여부)** 반환")
	@Parameters({
		@Parameter(name = "bookId", description = "도서 식별 번호", required = true, example = "1")
	})
	@GetMapping("/{bookId}")
	public ResponseEntity<PublishedBookInfoDto> getPublishedBookDetail(@PathVariable("bookId") Long bookId) {
		return new ResponseEntity<>(bookService.getPublishedBookDetail(bookId), HttpStatus.OK);
	}

	@Operation(summary = "좋아요 추가/삭제", description = "likedFlag = true : 좋아요 / likedFlag = false : 좋아요 해제")
	@JsonView(MemberBookStatusReqDto.LikeView.class)
	@PostMapping("/liked-books")
	public ResponseEntity<?> updateLikeStatus(@Valid @RequestBody MemberBookStatusReqDto bookStatusReqDto) {
		bookService.updateLikeStatus(bookStatusReqDto.getBookId(), bookStatusReqDto.getLikedFlag());
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "좋아요한 도서 조회", description = "사용자의 좋아요한 도서 리스트 반환")
	@GetMapping("/liked-books")
	public ResponseEntity<MemberPublishedBookListDto> getLikePublishedBookList() {
		return new ResponseEntity<>(bookService.getLikePublishedBookList(), HttpStatus.OK);
	}

	@Operation(summary = "출판 도서 담기", description = "bookId 도서 담기")
	@JsonView(MemberBookStatusReqDto.CartView.class)
	@PostMapping("/book-cart")
	public ResponseEntity<?> addPublishedBookToCart(@Valid @RequestBody MemberBookStatusReqDto bookStatusReqDto) {
		bookService.addPublishedBookToCart(bookStatusReqDto.getBookId(), bookStatusReqDto.getCartFlag());
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "담은 출판 도서 조회", description = "담은 출판 도서 조회")
	@GetMapping("/book-cart")
	public ResponseEntity<MemberPublishedBookListDto> getPublishedBookToCartList() {
		return new ResponseEntity<>(bookService.getPublishedBookToCartList(), HttpStatus.OK);
	}

}
