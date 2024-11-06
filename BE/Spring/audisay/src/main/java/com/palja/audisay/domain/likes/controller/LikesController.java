package com.palja.audisay.domain.likes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;
import com.palja.audisay.domain.book.dto.request.CursorPaginationReqDto;
import com.palja.audisay.domain.book.dto.request.MemberBookStatusReqDto;
import com.palja.audisay.domain.book.dto.response.BookCursorPaginationResDto;
import com.palja.audisay.domain.likes.service.LikesService;
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
@RequestMapping("/published-books/liked-books")
@Tag(name = "출판 도서 - 좋아요", description = "좋아요 추가(삭제) / 좋아요한 도서 조회 API")
public class LikesController {

	private final LikesService likesService;

	@Operation(summary = "좋아요 추가/삭제", description = "likedFlag = true : 좋아요 / likedFlag = false : 좋아요 해제")
	@JsonView(MemberBookStatusReqDto.LikeView.class)
	@PostMapping()
	public ResponseEntity<?> updateLikeStatus(@Valid @RequestBody MemberBookStatusReqDto bookStatusReqDto) {
		Long memberId = SessionUtil.getMemberId();
		likesService.modifyLikeStatus(memberId, bookStatusReqDto.getBookId(), bookStatusReqDto.getLikedFlag());
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "좋아요한 도서 조회", description = "사용자의 좋아요한 도서 리스트 반환")
	@Parameters({
		@Parameter(name = "lastDateTime", description = "마지막 조회한 도서 등록 일자(ex 2024-10-31T14:08:00)"),
		@Parameter(name = "lastId", description = "마지막 조회한 도서 Id"),
		@Parameter(name = "pageSize", description = "페이지 크기(기본값 10)")
	})
	@GetMapping()
	public ResponseEntity<BookCursorPaginationResDto> getLikePublishedBookList(
		@Schema(hidden = true) @Valid @ModelAttribute CursorPaginationReqDto cursorPaginationReqDto) {
		Long memberId = SessionUtil.getMemberId();
		return new ResponseEntity<>(likesService.findLikedPublishedBookList(memberId, cursorPaginationReqDto),
			HttpStatus.OK);
	}

}
