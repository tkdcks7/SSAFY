package com.palja.audisay.domain.book.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.SearchAfterValues;
import com.palja.audisay.domain.book.dto.SearchSort;
import com.palja.audisay.domain.book.dto.request.SearchPaginationReqDto;
import com.palja.audisay.domain.book.dto.response.PublishedBookInfoDto;
import com.palja.audisay.domain.book.dto.response.SearchCursorPaginationResDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.entity.BookIndex;
import com.palja.audisay.domain.book.entity.DType;
import com.palja.audisay.domain.book.repository.BookRepository;
import com.palja.audisay.global.exception.exceptions.PublishedBookNotFoundException;
import com.palja.audisay.global.util.ImageUtil;
import com.palja.audisay.global.util.StringUtil;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookService {

	private final ImageUtil imageUtil;
	private final BookRepository bookRepository;
	private final ElasticsearchOperations elasticsearchOperations;

	// 도서 상세 정보 조회 메서드.
	public PublishedBookInfoDto findPublishedBookDetail(Long memberId, Long bookId) {
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

	public SearchCursorPaginationResDto getSearchPublishedBookResult(SearchPaginationReqDto searchPaginationReqDto) {
		NativeQueryBuilder queryBuilder = NativeQuery.builder();

		// 검색 조건 설정
		if (StringUtil.isEmpty(searchPaginationReqDto.getKeyword())) {
			queryBuilder.withQuery(q -> q.matchAll(m -> m));
		} else {
			Query query = Query.of(q -> q
				.multiMatch(m -> m
					.query(searchPaginationReqDto.getKeyword())
					.fields(Arrays.asList("title", "author", "publisher"))
				)
			);
			queryBuilder.withQuery(query);
		}

		// size만 직접 설정
		queryBuilder.withMaxResults(searchPaginationReqDto.getPageSize());  // PageRequest 대신 이렇게 사용

		// 정렬 조건
		SearchSort sort = SearchSort.setSort(searchPaginationReqDto.getSortBy(), searchPaginationReqDto.getSortOrder());
		queryBuilder.withSort(Sort.by(Sort.Direction.DESC, "_score"))
			.withSort(Sort.by(sort.sortOrder(), sort.sortBy()))
			.withSort(Sort.by(Sort.Direction.ASC, "bookId"));

		// search_after 설정
		if (searchPaginationReqDto.getLastSearchId() != null) {
			SearchAfterValues searchAfter = SearchAfterValues.parse(searchPaginationReqDto.getLastSearchId());
			queryBuilder.withSearchAfter(searchAfter.values());
		}

		// 검색 실행
		SearchHits<BookIndex> searchHits = elasticsearchOperations.search(
			queryBuilder.build(),
			BookIndex.class
		);

		List<PublishedBookInfoDto> bookList = searchHits.getSearchHits().stream()
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

		// 다음 검색을 위한 searchId 생성
		String nextSearchId = searchHits.getSearchHits().isEmpty() ? null :
			SearchAfterValues.generateNextSearchId(
				searchHits.getSearchHits().getLast()
			);

		return SearchCursorPaginationResDto.builder()
			.bookList(bookList)
			.keyword(searchPaginationReqDto.getKeyword())
			.lastSearchId(nextSearchId)
			.build();
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
