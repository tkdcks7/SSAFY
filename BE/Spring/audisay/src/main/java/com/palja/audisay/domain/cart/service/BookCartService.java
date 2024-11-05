package com.palja.audisay.domain.cart.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.response.MemberPublishedBookListDto;
import com.palja.audisay.domain.book.dto.response.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.service.BookService;
import com.palja.audisay.domain.cart.entity.BookCart;
import com.palja.audisay.domain.cart.repository.BookCartRepository;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.service.MemberService;
import com.palja.audisay.global.util.ImageUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookCartService {

	private final BookCartRepository bookCartRepository;
	private final MemberService memberService;
	private final BookService bookService;
	private final ImageUtil imageUtil;

	// 출판 도서(기존 제공 도서) 담기
	public void savePublishedBookToCart(Long memberId, Long bookId, Boolean status) {
		// 사용자 검증
		Member member = memberService.validateMember(memberId);
		// 도서 검증
		Book book = bookService.validatePublishedBook(bookId);
		// 도서 카드에 도서 존재 여부 확인
		if (!status || bookCartRepository.existsByMemberAndBook(member, book)) {
			return;
		}
		BookCart bookCart = BookCart.builder().member(member).book(book).build();
		// 담을 도서 저장
		bookCartRepository.save(bookCart);
	}

	// 담은 출판 도서 조회
	public MemberPublishedBookListDto findCartPublishedBookList(Long memberId) {
		// 사용자 검증
		Member member = memberService.validateMember(memberId);
		// 담은 출판 도서 조회
		List<PublishedBookInfoDto> bookList = bookCartRepository.findBookCartByMemberId(member.getMemberId()).stream()
			.map(book -> PublishedBookInfoDto.builder()
				.cover(imageUtil.getFullImageUrl(book.getCover()))  // 이미지 URL 접두사 추가
				.coverAlt(book.getCoverAlt())
				.title(book.getTitle())
				.author(book.getAuthor())
				.bookId(book.getBookId())
				.dtype(book.getDtype())
				.build())
			.collect(Collectors.toList());
		return MemberPublishedBookListDto.builder().bookList(bookList).build();
	}
}
