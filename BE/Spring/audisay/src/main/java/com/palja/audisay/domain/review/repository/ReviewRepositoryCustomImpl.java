package com.palja.audisay.domain.review.repository;

import static com.palja.audisay.domain.review.entity.QReview.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.review.entity.Review;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class ReviewRepositoryCustomImpl extends QuerydslRepositorySupport implements ReviewRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public ReviewRepositoryCustomImpl(JPAQueryFactory queryFactory) {
		super(Review.class); // 부모 클래스에 Review 엔티티 정보 전달
		this.queryFactory = queryFactory;  // 쿼리 팩토리 주입
	}

	@Override
	public List<Review> findReviewsWithCursor(Long memberId, LocalDateTime updatedAtCursor, Long lastReviewId,
		Pageable pageable) {
		return findReviews(null, memberId, true, updatedAtCursor, lastReviewId, pageable);
	}

	@Override
	public Optional<Review> findMemberIdReviewForBook(Long memberId, Book book) {
		return Optional.ofNullable(queryFactory
			.selectFrom(review)
			.where(review.book.eq(book)
				.and(review.member.memberId.eq(memberId)))
			.fetchOne());
	}

	@Override
	public List<Review> findOtherReviewsWithCursor(Book book, Long memberId, LocalDateTime updatedAtCursor,
		Long lastReviewId, Pageable pageable) {
		return findReviews(book, memberId, false, updatedAtCursor, lastReviewId, pageable);
	}

	private BooleanExpression buildCursorCondition(LocalDateTime updatedAtCursor, Long lastReviewId) {
		BooleanExpression condition = review.updatedAt.lt(updatedAtCursor);
		if (lastReviewId != null) {
			condition = condition.or(review.updatedAt.eq(updatedAtCursor).and(review.reviewId.lt(lastReviewId)));
		}
		return condition;
	}

	private List<Review> findReviews(Book book, Long memberId, Boolean isMemberReview, LocalDateTime updatedAtCursor,
		Long lastReviewId, Pageable pageable) {
		BooleanExpression condition = (isMemberReview) ? review.member.memberId.eq(memberId) :
			review.book.eq(book).and(review.member.memberId.ne(memberId));
		condition = condition.and(buildCursorCondition(updatedAtCursor, lastReviewId));

		return queryFactory
			.selectFrom(review)
			.join(review.book).fetchJoin()  // book과의 fetch join 추가
			.join(review.member).fetchJoin() // member와의 fetch join 추가
			.where(condition)
			.orderBy(review.updatedAt.desc(), review.reviewId.desc())
			.limit(pageable.getPageSize())
			.fetch();
	}

}
