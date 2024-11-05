package com.palja.audisay.domain.review.repository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.review.entity.Review;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReviewRepositoryCustom {
    List<Review> findReviewsWithCursor(Long memberId, LocalDateTime updatedAtCursor, Long lastReviewId, Pageable pageable);

    Optional<Review> findMemberIdReviewForBook(Long memberId, Book book);

    List<Review> findOtherReviewsWithCursor(Book book, Long memberId, LocalDateTime updatedAtCursor, Long lastReviewId, Pageable pageable);
}
