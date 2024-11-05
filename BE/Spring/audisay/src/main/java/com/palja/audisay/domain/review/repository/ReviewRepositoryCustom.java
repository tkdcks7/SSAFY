package com.palja.audisay.domain.review.repository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.review.entity.Review;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReviewRepositoryCustom {
    List<Review> findReviewsWithCursor(Member member, LocalDateTime updatedAtCursor, Long lastReviewId, Pageable pageable);

    Optional<Review> findMemberReviewForBook(Member member, Book book);

    List<Review> findOtherReviewsWithCursor(Book book, Member member, LocalDateTime updatedAtCursor, Long lastReviewId, Pageable pageable);
}
