package com.palja.audisay.domain.cart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.cart.entity.BookCart;
import com.palja.audisay.domain.member.entity.Member;

public interface BookCartRepository extends JpaRepository<BookCart, Long> {

	// 회원의 기존 담은 도서 존재 여부 확인 메서드
	boolean existsByMemberAndBook(Member member, Book book);

}
