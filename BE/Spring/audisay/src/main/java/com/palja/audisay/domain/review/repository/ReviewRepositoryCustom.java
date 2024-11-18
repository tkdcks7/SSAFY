package com.palja.audisay.domain.review.repository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.review.entity.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewRepositoryCustom {
	Optional<Review> findMemberIdReviewForBook(Long memberId, Book book);

	List<Review> findReviewsWithCursor(Long memberId, Long lastReviewId, Integer pageSize);

	List<Review> findOtherReviewsWithCursor(Book book, Long memberId, Long lastReviewId, Integer pageSize);
}
