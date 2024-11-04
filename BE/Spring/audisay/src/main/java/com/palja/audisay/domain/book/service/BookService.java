package com.palja.audisay.domain.book.service;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.LastBookInfo;
import com.palja.audisay.domain.book.dto.request.BookSearchReqDto;
import com.palja.audisay.domain.book.dto.respose.BookSearchResDto;
import com.palja.audisay.domain.book.dto.respose.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.entity.Dtype;
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

	public BookSearchResDto getSearchPublishedBookResult(Long memberId, BookSearchReqDto bookSearchReqDto) {
		// 사용자 검증
		memberService.validateMember(memberId);

		List<Book> bookRawList = bookRepository.searchBookList(bookSearchReqDto);

		if (bookRawList.isEmpty()) {
			return BookSearchResDto.builder()
				.bookList(Collections.emptyList())
				.build();
		}

		// 도서 목록 후처리
		LastBookInfo lastBookInfo = processLastBookInfo(bookRawList, bookSearchReqDto.getPageSize());

		List<PublishedBookInfoDto> bookResultList = bookRawList.stream()
			.map(book -> PublishedBookInfoDto.builder()
				.bookId(book.getBookId())
				.title(book.getTitle())
				.cover(imageUtil.getFullImageUrl(book.getCover()))  // 이미지 URL 접두사 추가
				.coverAlt(book.getCoverAlt())
				.author(book.getAuthor())
				.dtype(book.getDtype())
				.publisher(book.getPublisher())
				.publishedAt(StringUtil.dateToString(book.getPublishedDate()))
				.build())
			.toList();

		return BookSearchResDto.builder()
			.keyword(bookSearchReqDto.getKeyword())
			.bookList(bookResultList)
			.lastCreatedAt(lastBookInfo.getLastCreatedAt())
			.lastBookId(lastBookInfo.getLastBookId())
			.build();
	}

	/**
	 * 조회한 목록에서 마지막 도서 정보 추출 메서드.
	 *
	 * @param bookRawList DB에서 추출한 원본 리스트.
	 * @param pageSize 요청한 페이지 크기.
	 * @return
	 */
	private LastBookInfo processLastBookInfo(List<Book> bookRawList, int pageSize) {
		boolean hasNext = bookRawList.size() > pageSize;
		if (hasNext) {
			bookRawList.removeLast();  // 마지막 도서 제거
		}
		Book lastBook = hasNext ? bookRawList.getLast() : null;
		return lastBook != null ? new LastBookInfo(lastBook.getBookId(), lastBook.getCreatedAt()) : new LastBookInfo();
	}

	public Book validatePublishedBook(Long bookId) {
		Book book = validateExistBook(bookId);
		if (!book.getDtype().equals(Dtype.PUBLISHED)) {
			throw new PublishedBookNotFoundException();
		}
		return book;
	}

	public Book validateExistBook(Long bookId) {
		return bookRepository.findByBookId(bookId).orElseThrow(PublishedBookNotFoundException::new);
	}
}
