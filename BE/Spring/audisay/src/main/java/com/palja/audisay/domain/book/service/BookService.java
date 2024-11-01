package com.palja.audisay.domain.book.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.repository.BookRepository;
import com.palja.audisay.domain.member.service.MemberService;
import com.palja.audisay.global.exception.exceptions.PublishedBookNotFoundException;
import com.palja.audisay.global.util.ImageUtil;
import com.palja.audisay.global.util.StringUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookService {

	private final ImageUtil imageUtil;
	private final MemberService memberService;
	private final BookRepository bookRepository;

	// 도서 상세 정보 조회 메서드.
	public PublishedBookInfoDto findPublishedBookDetail(Long memberId, Long bookId) {
		// 사용자 검증
		memberService.validateMember(memberId);
		// bookId의 상세 내용 조회
		// bookId의 리뷰 내용 조회
		// 사용자 bookId 관련 정보(cartFlag, likeFlag) 조회
		PublishedBookInfoDto publishedBookInfoDto = bookRepository.findBookDetailByBookIdAndMemberId(memberId, bookId)
			.orElseThrow(PublishedBookNotFoundException::new);
		// 출판 일시 (date) => (String) 변경
		String publishedStr = StringUtil.dateToString(publishedBookInfoDto.getPublishedDate());
		// 표지 이미지 url 처리
		String fullCoverUrl = imageUtil.getFullImageUrl(publishedBookInfoDto.getCoverRaw());
		publishedBookInfoDto.setPublishedAt(publishedStr);
		publishedBookInfoDto.setCover(fullCoverUrl);
		return publishedBookInfoDto;
	}

	public Book validateBook(Long bookId) {
		return bookRepository.findByBookId(bookId).orElseThrow(PublishedBookNotFoundException::new);
	}
}
