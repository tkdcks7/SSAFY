package com.palja.audisay.domain.review.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.palja.audisay.domain.review.dto.MyPageReviewListResponseDto;
import com.palja.audisay.domain.review.dto.ReviewListResponseDto;
import com.palja.audisay.domain.review.dto.ReviewRequestDto;
import com.palja.audisay.domain.review.service.ReviewService;
import com.palja.audisay.global.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
@Tag(name = "리뷰", description = "리뷰 등록, 조회, 수정, 삭제")
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/{bookId}")
    @Operation(summary = "특정 도서의 리뷰 조회", description = "본인의 리뷰와 다른 사람들의 리뷰를 최신순으로 조회")
    @Parameters({
            @Parameter(name = "bookId", description = "book ID", example = "1")
    })
    public ResponseEntity<ReviewListResponseDto> getBookReviews(
            @PathVariable Long bookId,
            @RequestParam(value = "lastDateTime", required = false) LocalDateTime lastUpdatedAt,
            @RequestParam(value = "lastId", required = false) Long lastReviewId,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {

        Long memberId = SessionUtil.getMemberId();
        ReviewListResponseDto response = reviewService.getBookReviewsWithMemberReview(memberId, bookId, lastUpdatedAt, lastReviewId, pageSize);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/mypage")
    @Operation(summary = "마이페이지 리뷰 조회 (커서 기반)", description = "회원의 최신순 리뷰 목록을 커서 기반으로 조회")
    public ResponseEntity<MyPageReviewListResponseDto> getMyReviews(
            @RequestParam(value = "lastDateTime", required = false) LocalDateTime lastUpdatedAt,
            @RequestParam(value = "lastId", required = false) Long lastReviewId,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        Long memberId = SessionUtil.getMemberId();
        MyPageReviewListResponseDto response = reviewService.getMyReviewsAfterCursor(memberId, lastUpdatedAt, lastReviewId, pageSize);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "리뷰 등록", description = "책에 대한 리뷰 등록")
    @JsonView(ReviewRequestDto.CreateView.class)
    public ResponseEntity<Void> createReview(@Valid @RequestBody ReviewRequestDto reviewRequestDto) {
        Long memberId = SessionUtil.getMemberId();
        reviewService.createReview(memberId, reviewRequestDto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{reviewId}")
    @Operation(summary = "리뷰 수정", description = "기존 리뷰를 수정")
    @JsonView(ReviewRequestDto.UpdateView.class)
    @Parameters({
            @Parameter(name = "reviewId", description = "review ID", example = "1")
    })
    public ResponseEntity<Void> updateReview(@PathVariable Long reviewId,
                                             @Valid @RequestBody ReviewRequestDto reviewRequestDto) {
        Long memberId = SessionUtil.getMemberId();
        reviewService.updateReview(memberId, reviewId, reviewRequestDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{reviewId}")
    @Operation(summary = "리뷰 삭제", description = "기존 리뷰 삭제")
    @Parameters({
            @Parameter(name = "reviewId", description = "review ID", example = "1")
    })
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        Long memberId = SessionUtil.getMemberId();
        reviewService.deleteReview(memberId, reviewId);
        return ResponseEntity.ok().build();
    }
}
