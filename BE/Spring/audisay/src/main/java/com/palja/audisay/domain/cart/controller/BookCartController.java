package com.palja.audisay.domain.cart.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;
import com.palja.audisay.domain.book.dto.request.MemberBookStatusReqDto;
import com.palja.audisay.domain.book.dto.response.MemberPublishedBookListDto;
import com.palja.audisay.domain.cart.service.BookCartService;
import com.palja.audisay.global.util.SessionUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/published-books/book-cart")
@Tag(name = "출판 도서 - 도서 담기", description = "출판 도서 담기 / 담은 도서 조회 API")
public class BookCartController {

	private final BookCartService bookCartService;

	@Operation(summary = "출판 도서 담기/삭제", description = "bookId 도서 담기/삭제")
	@JsonView(MemberBookStatusReqDto.CartView.class)
	@PostMapping()
	public ResponseEntity<?> addPublishedBookToCart(@Valid @RequestBody MemberBookStatusReqDto bookStatusReqDto) {
		Long memberId = SessionUtil.getMemberId();
		bookCartService.modifyCartStatus(memberId, bookStatusReqDto.getBookId(), bookStatusReqDto.getCartFlag());
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "담은 출판 도서 조회", description = "담은 출판 도서 조회")
	@GetMapping()
	public ResponseEntity<MemberPublishedBookListDto> getPublishedBookToCartList() {
		Long memberId = SessionUtil.getMemberId();
		return new ResponseEntity<>(bookCartService.findCartPublishedBookList(memberId), HttpStatus.OK);
	}
}
