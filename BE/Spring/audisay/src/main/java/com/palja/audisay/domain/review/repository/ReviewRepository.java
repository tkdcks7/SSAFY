package com.palja.audisay.domain.review.repository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long>, ReviewRepositoryCustom {
	boolean existsByMemberAndBook(Member member, Book book); // 중복 리뷰 확인 메서드

	int deleteByReviewIdAndMemberMemberId(Long reviewId, Long memberId);

}
