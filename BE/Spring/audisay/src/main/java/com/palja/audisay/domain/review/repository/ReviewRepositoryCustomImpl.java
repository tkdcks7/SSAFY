package com.palja.audisay.domain.review.repository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.review.entity.Review;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.palja.audisay.domain.review.entity.QReview.review;

@Repository
public class ReviewRepositoryCustomImpl extends QuerydslRepositorySupport implements ReviewRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public ReviewRepositoryCustomImpl(JPAQueryFactory queryFactory) {
		super(Review.class); // 부모 클래스에 Review 엔티티 정보 전달
		this.queryFactory = queryFactory;  // 쿼리 팩토리 주입
	}

	@Override
	public Optional<Review> findMemberIdReviewForBook(Long memberId, Book book) {
		return Optional.ofNullable(queryFactory
				.selectFrom(review)
				.where(review.book.eq(book)
						.and(review.member.memberId.eq(memberId)))
				.fetchOne());
	}

	//	@Override
	//	public List<Review> findReviewsWithCursor(Long memberId, LocalDateTime updatedAtCursor, Long lastReviewId,
	//											  Integer pageSize) {
	//		return findReviews(null, memberId, true, updatedAtCursor, lastReviewId, pageSize);
	//	}
	@Override
	public List<Review> findReviewsWithCursor(Long memberId, Long lastReviewId, Integer pageSize) {
		return findReviews(null, memberId, true, lastReviewId, pageSize);
	}

	@Override
	public List<Review> findOtherReviewsWithCursor(Book book, Long memberId, Long lastReviewId, Integer pageSize) {
		return findReviews(book, memberId, false, lastReviewId, pageSize);
	}

	private List<Review> findReviews(Book book, Long memberId, Boolean isMemberReview, Long lastReviewId, Integer pageSize) {
		BooleanExpression condition = (isMemberReview) ? review.member.memberId.eq(memberId) :
			review.book.eq(book).and(review.member.memberId.ne(memberId));
		condition = condition.and(buildCursorCondition(lastReviewId));

		return queryFactory
			.selectFrom(review)
			.join(review.book).fetchJoin()  // book과의 fetch join 추가
			.join(review.member).fetchJoin() // member와의 fetch join 추가
			.where(condition)
				.orderBy(review.reviewId.desc())
				.limit(pageSize)
			.fetch();
	}

	private BooleanExpression buildCursorCondition(Long lastReviewId) {
		return lastReviewId != null ? review.reviewId.lt(lastReviewId) : null;
	}

}
