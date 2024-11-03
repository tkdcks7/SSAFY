package com.palja.audisay.domain.cart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palja.audisay.domain.cart.entity.BookCart;
import com.palja.audisay.domain.cart.entity.BookCartId;
import com.palja.audisay.domain.member.entity.Member;

public interface BookCartRepository extends JpaRepository<BookCart, BookCartId> {
	int countByMember(Member member);
}
