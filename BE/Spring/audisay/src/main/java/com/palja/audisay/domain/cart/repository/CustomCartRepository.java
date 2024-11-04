package com.palja.audisay.domain.cart.repository;

import java.util.Optional;

import com.palja.audisay.domain.category.entity.Category;

public interface CustomCartRepository {
	Optional<Category> findCategoryByMemberIdAndBookCartCount(Long memberId);
}
