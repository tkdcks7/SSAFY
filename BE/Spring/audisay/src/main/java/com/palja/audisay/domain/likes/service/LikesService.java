package com.palja.audisay.domain.likes.service;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.LastBookInfo;
import com.palja.audisay.domain.book.dto.request.CursorPaginationReqDto;
import com.palja.audisay.domain.book.dto.response.BookCursorPaginationResDto;
import com.palja.audisay.domain.book.dto.response.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.service.BookService;
import com.palja.audisay.domain.likes.dto.LikesJoinBookDto;
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

	private final LikesRepository likesRepository;
	private final MemberService memberService;
	private final BookService bookService;
	private final ImageUtil imageUtil;

	// 좋아요 상태 업데이트 메서드.
	public void modifyLikeStatus(Long memberId, Long bookId, Boolean isLike) {
		// 사용자 검증
		Member member = memberService.validateMember(memberId);
		// 도서 검증
		Book book = bookService.validatePublishedBook(bookId);
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

	// 좋아요한 도서 조회
	public BookCursorPaginationResDto findLikedPublishedBookList(Long memberId,
		CursorPaginationReqDto cursorPaginationReqDto) {

		// 좋아요한 도서 조회
		List<LikesJoinBookDto> bookRawList = likesRepository.findLikedBooksByMemberId(memberId,
			cursorPaginationReqDto);
		if (bookRawList.isEmpty()) {
			return BookCursorPaginationResDto.builder()
				.bookList(Collections.emptyList())
				.build();
		}
		// 도서 목록 후처리
		LastBookInfo lastBookInfo = processLastBookInfo(bookRawList, cursorPaginationReqDto.getPageSize());

		List<PublishedBookInfoDto> bookResultList = bookRawList.stream()
			.map(book -> PublishedBookInfoDto.builder()
				.bookId(book.getBookId())
				.title(book.getTitle())
				.cover(imageUtil.getFullImageUrl(book.getCover()))  // 이미지 URL 접두사 추가
				.coverAlt(book.getCoverAlt())
				.author(book.getAuthor())
				.dtype(book.getDtype())
				.build())
			.toList();

		return BookCursorPaginationResDto.builder()
			.bookList(bookResultList)
			.lastDateTime(lastBookInfo.lastCreatedAt())
			.lastId(lastBookInfo.lastBookId())
			.build();
	}

	/**
	 * 조회한 목록에서 마지막 도서 정보 추출 메서드.
	 *
	 * @param bookRawList DB에서 추출한 원본 리스트.
	 * @param pageSize 요청한 페이지 크기.
	 * @return LastBookInfo 마지막 조회 도서 정보 반환.
	 */
	public LastBookInfo processLastBookInfo(List<LikesJoinBookDto> bookRawList, int pageSize) {
		boolean hasNext = bookRawList.size() > pageSize;
		if (hasNext) {
			bookRawList.removeLast();  // 마지막 도서 제거
		}
		LikesJoinBookDto lastBook = hasNext ? bookRawList.getLast() : null;
		return lastBook != null ? new LastBookInfo(lastBook.getBookId(), lastBook.getCreatedAtLike()) :
			new LastBookInfo();
	}
}
