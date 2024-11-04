package com.palja.audisay.domain.cart.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.book.entity.QBook;
import com.palja.audisay.domain.cart.entity.QBookCart;
import com.palja.audisay.domain.category.entity.Category;
import com.palja.audisay.domain.category.entity.QCategory;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomCartRepositoryImpl implements CustomCartRepository {
	private final JPAQueryFactory jpaQueryFactory;
	QBookCart bookCart = QBookCart.bookCart;
	QBook book = QBook.book;
	QCategory category = QCategory.category;

	@Override
	public Optional<Category> findCategoryByMemberIdAndBookCartCount(Long memberId) {
		return Optional.ofNullable(
			jpaQueryFactory
				.select(category)
				.from(bookCart)
				.join(bookCart.book, book)
				.join(book.category, category)
				.where(bookCart.member.memberId.eq(memberId))
				.groupBy(category.categoryId)
				.orderBy(bookCart.count().desc())
				.fetchFirst()
		);
	}
}
