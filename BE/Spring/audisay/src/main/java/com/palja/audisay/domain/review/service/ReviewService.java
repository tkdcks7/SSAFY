package com.palja.audisay.domain.review.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.service.BookService;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.service.MemberService;
import com.palja.audisay.domain.review.dto.MyPageReviewListResponseDto;
import com.palja.audisay.domain.review.dto.ReviewListResponseDto;
import com.palja.audisay.domain.review.dto.ReviewRequestDto;
import com.palja.audisay.domain.review.dto.ReviewResponseDto;
import com.palja.audisay.domain.review.entity.Review;
import com.palja.audisay.domain.review.repository.ReviewRepository;
import com.palja.audisay.global.exception.exceptions.ReviewBookDuplicatedException;
import com.palja.audisay.global.exception.exceptions.ReviewNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {
	private final MemberService memberService;
	private final BookService bookService;
	private final ReviewRepository reviewRepository;

	public ReviewListResponseDto getBookReviewsWithMemberReview(Long memberId, Long bookId, String cursor,
		int pageSize) {
		Member member = memberService.validateMember(memberId);
		Book book = bookService.validatePublishedBook(bookId);
		// 본인의 리뷰 조회
		Review memberReview = reviewRepository.findByMemberAndBook(member, book).orElse(null);
		ReviewResponseDto memberReviewDto =
			(memberReview != null) ? ReviewResponseDto.toMemberReviewDto(memberReview) : null;

		// 다른 사용자의 리뷰 조회 (Cursor 기반 페이징)
		LocalDateTime updatedAtCursor = (cursor != null) ?
			LocalDateTime.parse(cursor, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")) : LocalDateTime.now();

		Pageable pageable = PageRequest.of(0, pageSize);
		List<Review> reviews = reviewRepository.findByBookAndMemberNotAndUpdatedAtLessThanOrderByUpdatedAtDesc(book,
			member, updatedAtCursor, pageable);

		List<ReviewResponseDto> reviewList = reviews.stream().map(ReviewResponseDto::toReviewListDto).toList();

		// 다음 커서 계산 (다음 페이지가 없다면 null 반환)
		String nextCursor = (reviews.size() < pageSize) ? null : reviews.getLast().getUpdatedAt()
			.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));

		return ReviewListResponseDto.builder()
			.memberReview(memberReviewDto)
			.reviewList(reviewList)
			.nextCursor(nextCursor)
			.build();
	}

	public MyPageReviewListResponseDto getMyReviewsAfterCursor(Long memberId, String cursor, int pageSize) {
		Member member = memberService.validateMember(memberId);
		LocalDateTime updatedAtCursor = (cursor != null) ?
			LocalDateTime.parse(cursor, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")) : LocalDateTime.now();

		Pageable pageable = PageRequest.of(0, pageSize);
		List<Review> reviews = reviewRepository.findByMemberAndUpdatedAtLessThanOrderByUpdatedAtDesc(member,
			updatedAtCursor, pageable);

		List<ReviewResponseDto> reviewList = reviews.stream().map(ReviewResponseDto::toDto).toList();
		String nextCursor = (reviews.size() < pageSize) ? null : reviews.getLast().getUpdatedAt()
			.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));

		return MyPageReviewListResponseDto.builder()
			.reviewList(reviewList)
			.nextCursor(nextCursor)
			.build();
	}

	@Transactional
	public void createReview(Long memberId, ReviewRequestDto reviewRequestDto) {
		Member member = memberService.validateMember(memberId);
		Book book = bookService.validatePublishedBook(reviewRequestDto.getBookId());
		// 이미 리뷰가 존재하는지 확인
		if (reviewRepository.existsByMemberAndBook(member, book)) {
			throw new ReviewBookDuplicatedException(); // 중복된 책 예외 던짐
		}
		Review review = reviewRequestDto.toEntity(member, book);
		reviewRepository.save(review);
	}

	@Transactional
	public void updateReview(Long memberId, Long reviewId, ReviewRequestDto reviewRequestDto) {
		memberService.validateMember(memberId);
		Review review = reviewRepository.findById(reviewId).orElseThrow(ReviewNotFoundException::new);

		if (reviewRequestDto.getScore() != null) { // requestBody에 score가 존재할 때만 score 업데이트
			review.setScore(reviewRequestDto.getScore().byteValue());
		}
		if (reviewRequestDto.getContent() != null) { // requestBody에 content가 존재할 때만 score 업데이트
			review.setContent(reviewRequestDto.getContent());
		}
		reviewRepository.save(review);
	}

	@Transactional
	public void deleteReview(Long memberId, Long reviewId) {
		memberService.validateMember(memberId);
		int deletedCount = reviewRepository.deleteByReviewIdAndMemberMemberId(reviewId, memberId);
		if (deletedCount == 0) { // 리뷰가 존재하는지 확인
			throw new ReviewNotFoundException();
		}
	}

}
