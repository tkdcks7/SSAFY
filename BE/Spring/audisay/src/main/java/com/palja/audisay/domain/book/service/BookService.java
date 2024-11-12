package com.palja.audisay.domain.book.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.SearchAfterValues;
import com.palja.audisay.domain.book.dto.request.SearchPaginationReqDto;
import com.palja.audisay.domain.book.dto.response.PublishedBookInfoDto;
import com.palja.audisay.domain.book.dto.response.SearchCursorPaginationResDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.entity.BookIndex;
import com.palja.audisay.domain.book.entity.DType;
import com.palja.audisay.domain.book.repository.BookIndexRepository;
import com.palja.audisay.domain.book.repository.BookRepository;
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
	private final BookRepository bookRepository;
	private final BookIndexRepository bookIndexRepository;

	// 도서 상세 정보 조회 메서드.
	public PublishedBookInfoDto findPublishedBookDetail(Long memberId, Long bookId) {
		// bookId의 상세 내용 조회
		// bookId의 리뷰 내용 조회
		// 사용자 bookId 관련 정보(cartFlag, likeFlag) 조회
		// bookId Epub 보유 여부 조회
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

	public SearchCursorPaginationResDto searchPublishedBookResult(SearchPaginationReqDto searchPaginationReqDto) {
		// 검색 실행
		SearchHits<BookIndex> searchHits = bookIndexRepository.searchPublishedBooks(searchPaginationReqDto);

		// 다음 검색을 위한 searchId 생성
		String nextSearchId = generateNextSearchId(searchHits);

		List<PublishedBookInfoDto> bookList = convertSearchHitsToPublishedBookInfoDtoList(searchHits);

		return SearchCursorPaginationResDto.builder()
			.bookList(bookList)
			.keyword(searchPaginationReqDto.getKeyword())
			.lastSearchId(nextSearchId)
			.build();
	}

	private List<PublishedBookInfoDto> convertSearchHitsToPublishedBookInfoDtoList(SearchHits<BookIndex> searchHits) {
		return searchHits.getSearchHits().stream()
			.map(hit -> PublishedBookInfoDto.builder()
				.bookId(hit.getContent().getBookId())
				.title(hit.getContent().getTitle())
				.category(hit.getContent().getCategory())
				.cover(hit.getContent().getCover())
				.coverAlt(hit.getContent().getCoverAlt())
				.author(hit.getContent().getAuthor())
				.publisher(hit.getContent().getPublisher())
				.publishedAt(StringUtil.dateToString(hit.getContent().getPublishedDate()))
				.dType(DType.valueOf(hit.getContent().getDType()))
				.reviewDistribution(PublishedBookInfoDto.ReviewDistribution.builder()
					.average(Double.valueOf(hit.getContent().getReview()))
					.build())
				.build())
			.collect(Collectors.toList());
	}

	private String generateNextSearchId(SearchHits<BookIndex> searchHits) {
		return searchHits.getSearchHits().isEmpty() ? null :
			SearchAfterValues.generateNextSearchId(searchHits.getSearchHits().getLast());
	}

	public Book validatePublishedBook(Long bookId) {
		Book book = bookRepository.findByBookId(bookId).orElseThrow(PublishedBookNotFoundException::new);
		if (!book.getDType().equals(DType.PUBLISHED)) {
			throw new PublishedBookNotFoundException();
		}
		return book;
	}

	public Book validateRegisteredBook(Long bookId) {
		Book book = bookRepository.findByBookId(bookId).orElseThrow(PublishedBookNotFoundException::new);
		if (!book.getDType().equals(DType.REGISTERED)) {
			throw new PublishedBookNotFoundException();
		}
		return book;
	}
}
