package com.palja.audisay.domain.likes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;
import com.palja.audisay.domain.book.dto.request.MemberBookStatusReqDto;
import com.palja.audisay.domain.book.dto.respose.MemberPublishedBookListDto;
import com.palja.audisay.domain.likes.service.LikesService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/published-books/liked-books")
@Tag(name = "출판 도서 - 좋아요", description = "좋아요 추가(삭제) / 좋아요한 도서 조회 API")
public class LikesController {

	private final LikesService likesService;
	// 임시 memberId
	private final Long tempMemberId = 1L;

	@Operation(summary = "좋아요 추가/삭제", description = "likedFlag = true : 좋아요 / likedFlag = false : 좋아요 해제")
	@JsonView(MemberBookStatusReqDto.LikeView.class)
	@PostMapping()
	public ResponseEntity<?> updateLikeStatus(@Valid @RequestBody MemberBookStatusReqDto bookStatusReqDto) {
		likesService.modifyLikeStatus(tempMemberId, bookStatusReqDto.getBookId(), bookStatusReqDto.getLikedFlag());
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "좋아요한 도서 조회", description = "사용자의 좋아요한 도서 리스트 반환")
	@GetMapping()
	public ResponseEntity<MemberPublishedBookListDto> getLikePublishedBookList() {
		return new ResponseEntity<>(likesService.findLikedPublishedBookList(tempMemberId), HttpStatus.OK);
	}

}
