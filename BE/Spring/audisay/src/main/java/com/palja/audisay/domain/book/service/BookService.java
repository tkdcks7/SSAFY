package com.palja.audisay.domain.book.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.repository.BookRepository;
import com.palja.audisay.domain.member.service.MemberService;
import com.palja.audisay.global.exception.exceptions.PublishedBookNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookService {

	private final MemberService memberService;
	private final BookRepository bookRepository;

	// 도서 상세 정보 조회 메서드.
	public PublishedBookInfoDto findPublishedBookDetail(Long memberId, Long bookId) {
		// 사용자 검증
		memberService.validateMember(memberId);
		// bookId의 상세 내용 조회
		// bookId의 리뷰 내용 조회
		// 사용자 bookId 관련 정보(cartFlag, likeFlag) 조회
		return bookRepository.findBookDetailByBookIdAndMemberId(memberId, bookId)
			.orElseThrow(PublishedBookNotFoundException::new);
	}

	public Book validateBook(Long bookId) {
		return bookRepository.findByBookId(bookId).orElseThrow(PublishedBookNotFoundException::new);
	}
}
