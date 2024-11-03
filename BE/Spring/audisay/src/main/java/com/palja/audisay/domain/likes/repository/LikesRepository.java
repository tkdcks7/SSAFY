package com.palja.audisay.domain.likes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.likes.entity.Likes;
import com.palja.audisay.domain.member.entity.Member;

public interface LikesRepository extends JpaRepository<Likes, Long> {
	// 회원의 기존 좋아요 존재 여부 확인 메서드
	boolean existsByMemberAndBook(Member member, Book book);

	// 회원이 좋아한 책 목록 조회 메서드
	@Query("""
		SELECT b
		FROM Likes l JOIN l.book b
		on l.member.memberId = :memberId and l.book.bookId = b.bookId
		ORDER BY l.createdAt DESC
		""")
	List<Book> findLikedBooksByMemberId(@Param("memberId") Long memberId);

	// 좋아요 삭제 메서드
	void deleteByMemberAndBook(Member member, Book book);
}
