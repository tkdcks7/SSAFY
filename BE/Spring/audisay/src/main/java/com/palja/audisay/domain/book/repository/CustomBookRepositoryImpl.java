package com.palja.audisay.domain.book.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.book.dto.request.CursorPaginationReqDto;
import com.palja.audisay.domain.book.dto.response.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.entity.Dtype;
import com.palja.audisay.domain.book.entity.QBook;
import com.palja.audisay.domain.cart.entity.QBookCart;
import com.palja.audisay.domain.category.entity.QCategory;
import com.palja.audisay.domain.likes.entity.QLikes;
import com.palja.audisay.domain.review.entity.QReview;
import com.palja.audisay.global.util.StringUtil;
import com.querydsl.core.BooleanBuilder;
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
	public final int ROUND_SCALE = 3;

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
					roundTo(review.score.avg().coalesce(0.0)).as("average"),
					roundTo(calculateScorePercentage(review.score, 5)).as("five"),
					roundTo(calculateScorePercentage(review.score, 4)).as("four"),
					roundTo(calculateScorePercentage(review.score, 3)).as("three"),
					roundTo(calculateScorePercentage(review.score, 2)).as("two"),
					roundTo(calculateScorePercentage(review.score, 1)).as("one")
				).as("reviewDistribution"),
				// 사용자가 좋아요/담은 상태
				Projections.fields(PublishedBookInfoDto.MemberInfo.class,
					bookCart.book.bookId.isNotNull().as("cartFlag"),
					likes.book.bookId.isNotNull().as("likedFlag")
				).as("memberInfo")
			));
		return Optional.ofNullable(query.fetchOne());
	}

	@Override
	public List<Book> searchBookList(CursorPaginationReqDto searchReqDto) {
		QBook book = QBook.book;
		// 검색 조건 생성
		BooleanBuilder searchCondition = createSearchCondition(searchReqDto, book);
		// 데이터 조회
		return jpaQueryFactory
			.selectFrom(book)
			.where(searchCondition)
			.orderBy(
				book.createdAt.desc(),
				book.bookId.desc()
			)
			.limit(searchReqDto.getPageSize() + 1)
			.fetch();
	}

	private BooleanBuilder createSearchCondition(CursorPaginationReqDto searchReqDto, QBook book) {
		BooleanBuilder builder = new BooleanBuilder();
		// 키워드 검색 조건 추가
		addKeywordCondition(searchReqDto, book, builder);
		// 커서 조건 추가
		addCursorCondition(searchReqDto, book, builder);
		// dType이 PUBLISHED인 조건 추가
		builder.and(book.dtype.eq(Dtype.PUBLISHED));
		return builder;
	}

	private void addKeywordCondition(CursorPaginationReqDto searchReqDto, QBook book, BooleanBuilder builder) {
		if (!StringUtil.isEmpty(searchReqDto.getKeyword())) {
			builder.and(
				book.title.containsIgnoreCase(searchReqDto.getKeyword())
					.or(book.author.containsIgnoreCase(searchReqDto.getKeyword()))
					.or(book.publisher.containsIgnoreCase(searchReqDto.getKeyword()))
			);
		}
	}

	private void addCursorCondition(CursorPaginationReqDto searchReqDto, QBook book, BooleanBuilder builder) {
		if (searchReqDto.getLastDateTime() != null) {
			builder.and(
				book.createdAt.lt(searchReqDto.getLastDateTime())
					.or(book.createdAt.eq(searchReqDto.getLastDateTime())
						.and(book.bookId.lt(searchReqDto.getLastId())))
			);
		}
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

	private NumberExpression<Double> roundTo(NumberExpression<Double> expression) {
		return expression
			.multiply(Math.pow(10, ROUND_SCALE)) // scale에 따라 10의 제곱을 곱함
			.round() // 반올림
			.divide(Math.pow(10, ROUND_SCALE)); // 다시 scale에 따라 나눔
	}
}
