package com.palja.audisay.domain.likes.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.book.dto.request.CursorPaginationReqDto;
import com.palja.audisay.domain.book.entity.Dtype;
import com.palja.audisay.domain.book.entity.QBook;
import com.palja.audisay.domain.likes.dto.LikesJoinBookDto;
import com.palja.audisay.domain.likes.entity.QLikes;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomLikesRepositoryImpl implements CustomLikesRepository {
	private final JPAQueryFactory jpaQueryFactory;
	QBook book = QBook.book;
	QLikes likes = QLikes.likes;

	@Override
	public List<LikesJoinBookDto> findLikedBooksByMemberId(Long memberId,
		CursorPaginationReqDto cursorPaginationReqDto) {
		// 검색 조건 생성
		BooleanBuilder cursorCondition = createCondition(cursorPaginationReqDto);
		// 데이터 조회
		return jpaQueryFactory
			.select(Projections.fields(LikesJoinBookDto.class,
				book.bookId,
				book.cover.as("coverRaw"),
				book.coverAlt,
				book.title,
				book.author,
				book.dtype,
				likes.createdAt.as("createdAtLike")
			))
			.from(likes)
			.join(likes.book, book)
			.on(likes.member.memberId.eq(memberId))
			.where(cursorCondition)
			.orderBy(
				likes.createdAt.desc(),
				likes.book.bookId.desc()
			)
			.limit(cursorPaginationReqDto.getPageSize() + 1)
			.fetch();
	}

	private BooleanBuilder createCondition(CursorPaginationReqDto searchReqDto) {
		BooleanBuilder builder = new BooleanBuilder();
		// 커서 조건 추가
		addCursorCondition(searchReqDto, builder);
		// dType이 PUBLISHED인 조건 추가
		builder.and(book.dtype.eq(Dtype.PUBLISHED));
		return builder;
	}

	private void addCursorCondition(CursorPaginationReqDto searchReqDto, BooleanBuilder builder) {
		if (searchReqDto.getLastDateTime() != null) {
			builder.and(
				likes.createdAt.lt(searchReqDto.getLastDateTime())
					.or(likes.createdAt.eq(searchReqDto.getLastDateTime())
						.and(likes.book.bookId.lt(searchReqDto.getLastId())))
			);
		}
	}
}
