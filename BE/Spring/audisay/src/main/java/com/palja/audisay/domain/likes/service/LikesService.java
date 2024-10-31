package com.palja.audisay.domain.likes.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.service.BookService;
import com.palja.audisay.domain.likes.entity.Likes;
import com.palja.audisay.domain.likes.repository.LikesRepository;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.service.MemberService;
import com.palja.audisay.global.util.ImageUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class LikesService {

	private final MemberService memberService;
	private final LikesRepository likesRepository;
	private final BookService bookService;
	private final ImageUtil imageUtil;

	// 좋아요 상태 업데이트 메서드.
	public void modifyLikeStatus(Long memberId, Long bookId, Boolean isLike) {
		// 사용자 검증
		Member member = memberService.validateMember(memberId);
		// 도서 검증
		Book book = bookService.validateBook(bookId);
		// 좋아요 상태 확인
		boolean isCurLike = isCurrentlyLiked(member, book);
		if (isLike && !isCurLike) {
			saveBookLike(member, book);
		} else if (!isLike && isCurLike) {
			deleteBookLike(member, book);
		}
	}

	// 좋아요 해제
	public void deleteBookLike(Member member, Book book) {
		likesRepository.deleteByMemberAndBook(member, book);
	}

	// 좋아요 지정
	public void saveBookLike(Member member, Book book) {
		Likes like = Likes.builder().member(member).book(book).build();
		likesRepository.save(like);
	}

	public boolean isCurrentlyLiked(Member member, Book book) {
		return likesRepository.existsByMemberAndBook(member, book);
	}
}
