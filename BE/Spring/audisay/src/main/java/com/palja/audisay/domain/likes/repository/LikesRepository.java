package com.palja.audisay.domain.likes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.likes.entity.Likes;
import com.palja.audisay.domain.likes.entity.LikesId;
import com.palja.audisay.domain.member.entity.Member;

public interface LikesRepository extends JpaRepository<Likes, LikesId>, CustomLikesRepository {
	// 회원의 기존 좋아요 존재 여부 확인 메서드
	boolean existsByMemberAndBook(Member member, Book book);

	// 좋아요 삭제 메서드
	void deleteByMemberAndBook(Member member, Book book);

	int countByMember(Member member);
}
