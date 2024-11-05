package com.palja.audisay.domain.review.repository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long>, ReviewRepositoryCustom {

	int deleteByReviewIdAndMemberMemberId(Long reviewId, Long memberId);

	boolean existsByMemberMemberIdAndBook(Long memberId, Book book);
}
