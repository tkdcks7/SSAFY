package com.palja.audisay.domain.review.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
	boolean existsByMemberAndBook(Member member, Book book); // 중복 리뷰 확인 메서드

	int deleteByReviewIdAndMemberMemberId(Long reviewId, Long memberId);

	List<Review> findByMemberAndUpdatedAtLessThanOrderByUpdatedAtDesc(
		Member member, LocalDateTime updatedAt, Pageable pageable);

	Optional<Review> findByMemberAndBook(Member member, Book book);

	List<Review> findByBookAndMemberNotAndUpdatedAtLessThanOrderByUpdatedAtDesc(Book book, Member member,
		LocalDateTime updatedAt, Pageable pageable);
}
