package com.palja.audisay.domain.book.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.book.dto.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.QBook;
import com.palja.audisay.domain.cart.entity.QBookCart;
import com.palja.audisay.domain.category.entity.QCategory;
import com.palja.audisay.domain.likes.entity.QLikes;
import com.palja.audisay.domain.review.entity.QReview;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomBookRepositoryImpl implements CustomBookRepository {
	private final JPAQueryFactory jpaQueryFactory;

	@Override
	public Optional<PublishedBookInfoDto> findBookDetailByBookIdAndMemberId(Long bookId, Long memberId) {
		QBook book = QBook.book;
		QCategory category = QCategory.category;
		QReview review = QReview.review;
		QLikes likes = QLikes.likes;
		QBookCart bookCart = QBookCart.bookCart;

		JPQLQuery<PublishedBookInfoDto> query = jpaQueryFactory.from(book)
			.leftJoin(category).on(book.category.categoryId.eq(category.categoryId))
			.leftJoin(review).on(book.bookId.eq(review.book.bookId))
			.leftJoin(likes).on(book.bookId.eq(likes.book.bookId).and(likes.member.memberId.eq(memberId)))
			.leftJoin(bookCart).on(book.bookId.eq(bookCart.book.bookId).and(bookCart.member.memberId.eq(memberId)))
			.where(book.bookId.eq(bookId))
			.groupBy(book.bookId, category.categoryName)
			.select(Projections.fields(PublishedBookInfoDto.class,
				book.bookId,
				book.title,
				book.cover.as("coverRaw"),
				book.coverAlt,
				category.categoryName.as("category"),
				book.author,
				book.publisher,
				book.publishedDate,
				book.story,
				book.isbn,
				book.dtype,
				book.myTtsFlag,
				// 도서 리뷰 통계
				Projections.fields(PublishedBookInfoDto.ReviewDistribution.class,
					review.score.avg().coalesce(0.0).as("average"),
					calculateScorePercentage(review.score, 5).as("five"),
					calculateScorePercentage(review.score, 4).as("four"),
					calculateScorePercentage(review.score, 3).as("three"),
					calculateScorePercentage(review.score, 2).as("two"),
					calculateScorePercentage(review.score, 1).as("one")
				),
				// 사용자가 좋아요/담은 상태
				Projections.fields(PublishedBookInfoDto.MemberInfo.class,
					bookCart.book.bookId.isNotNull().as("cartFlag"),
					likes.book.bookId.isNotNull().as("likedFlag")
				)
			));
		return Optional.ofNullable(query.fetchOne());
	}

	private NumberExpression<Double> calculateScorePercentage(NumberPath<Byte> scorePath, int targetScore) {
		return Expressions.cases()
			.when(scorePath.count().eq(0L)).then(0.0)
			.otherwise(
				scorePath.when((byte)targetScore).then(1.0).otherwise(0.0).sum()
					.multiply(100.0)
					.divide(scorePath.count())
			).coalesce(0.0);
	}
}
