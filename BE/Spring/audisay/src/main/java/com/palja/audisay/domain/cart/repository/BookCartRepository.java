package com.palja.audisay.domain.cart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.cart.entity.BookCart;
import com.palja.audisay.domain.cart.entity.BookCartId;
import com.palja.audisay.domain.member.entity.Member;

public interface BookCartRepository extends JpaRepository<BookCart, BookCartId> {

	// 회원의 기존 담은 도서 존재 여부 확인 메서드
	boolean existsByMemberAndBook(Member member, Book book);

	// 회원이 좋아한 책 목록 조회 메서드
	@Query("""
		SELECT b
		FROM BookCart bc JOIN bc.book b
		on bc.member.memberId = :memberId and bc.book.bookId = b.bookId
		ORDER BY bc.createdAt DESC
		""")
	List<Book> findBookCartByMemberId(@Param("memberId") Long memberId);

	int countByMember(Member member);

	void deleteByMemberAndBook(Member member, Book book);
}
