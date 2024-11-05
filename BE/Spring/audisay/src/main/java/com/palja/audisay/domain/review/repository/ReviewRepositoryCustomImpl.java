package com.palja.audisay.domain.review.repository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.review.entity.Review;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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
    public List<Review> findReviewsWithCursor(Member member, LocalDateTime updatedAtCursor, Long lastReviewId, Pageable pageable) {
        return findReviews(null, member, true, updatedAtCursor, lastReviewId, pageable);
    }

    @Override
    public Optional<Review> findMemberReviewForBook(Member member, Book book) {
        return Optional.ofNullable(queryFactory
                .selectFrom(review)
                .where(review.book.eq(book)
                        .and(review.member.eq(member)))
                .fetchOne());
    }

    @Override
    public List<Review> findOtherReviewsWithCursor(Book book, Member member, LocalDateTime updatedAtCursor, Long lastReviewId, Pageable pageable) {
        return findReviews(book, member, false, updatedAtCursor, lastReviewId, pageable);
    }

    private BooleanExpression buildCursorCondition(LocalDateTime updatedAtCursor, Long lastReviewId) {
        BooleanExpression condition = review.updatedAt.lt(updatedAtCursor);
        if (lastReviewId != null) {
            condition = condition.or(review.updatedAt.eq(updatedAtCursor).and(review.reviewId.lt(lastReviewId)));
        }
        return condition;
    }

    private List<Review> findReviews(Book book, Member member, Boolean isMemberReview, LocalDateTime updatedAtCursor, Long lastReviewId, Pageable pageable) {
        BooleanExpression condition = (isMemberReview) ? review.member.eq(member) : review.book.eq(book).and(review.member.ne(member));
        condition = condition.and(buildCursorCondition(updatedAtCursor, lastReviewId));

        return queryFactory
                .selectFrom(review)
                .where(condition)
                .orderBy(review.updatedAt.desc(), review.reviewId.desc())
                .limit(pageable.getPageSize())
                .fetch();
    }

}
