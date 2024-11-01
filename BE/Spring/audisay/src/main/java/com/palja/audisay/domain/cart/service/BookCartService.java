package com.palja.audisay.domain.cart.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.MemberPublishedBookListDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookCartService {
	// 출판 도서(기존 제공 도서) 담기
	public void savePublishedBookToCart(Long memberId, Long bookId, Boolean status) {
		// 사용자 검증
		// 도서 카드에 도서 존재 여부 확인
		// 담을 도서 저장
	}

	// 담은 출판 도서 조회
	public MemberPublishedBookListDto findCartPublishedBookList(Long memberId) {
		// 사용자 검증
		// 담은 출판 도서 조회
		return MemberPublishedBookListDto.builder().build();
	}
}
