package com.palja.audisay.domain.recommendation.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.repository.BookRepository;
import com.palja.audisay.domain.member.entity.Gender;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.repository.MemberRepository;
import com.palja.audisay.domain.recommendation.dto.response.RecommendationBookDto;
import com.palja.audisay.domain.recommendation.entity.Criterion;
import com.palja.audisay.domain.recommendation.entity.DemographicsBook;
import com.palja.audisay.domain.recommendation.entity.FamousBook;
import com.palja.audisay.domain.recommendation.repository.CategoryBookRepository;
import com.palja.audisay.domain.recommendation.repository.DemographicsBookRepository;
import com.palja.audisay.domain.recommendation.repository.FamousBookRepository;
import com.palja.audisay.domain.recommendation.repository.SimilarBookRepository;
import com.palja.audisay.domain.recommendation.repository.SimilarMemberBookRepository;
import com.palja.audisay.global.exception.exceptions.MemberNotFoundException;
import com.palja.audisay.global.exception.exceptions.RecommendationNotFoundException;
import com.palja.audisay.global.util.ImageUtil;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RecommendationService {
	private final MemberRepository memberRepository;
	private final BookRepository bookRepository;
	// recommendation 목록
	private final DemographicsBookRepository demographicsBookRepository;
	private final FamousBookRepository famousBookRepository;
	private final CategoryBookRepository categoryBookRepository;
	private final SimilarBookRepository similarBookRepository;
	private final SimilarMemberBookRepository similarMemberBookRepository;
	// util
	private final ImageUtil imageUtil;

	// 인기 도서 조회
	public RecommendationBookDto getFamousBooks() {
		// 1. 최신 인기 도서 조회 (mongoDB)
		FamousBook famousBook = famousBookRepository.findFirstByOrderByGroupIdDesc();
		if (famousBook == null) {
			throw new RecommendationNotFoundException();
		}
		// 2. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(famousBook.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.FAMOUS_BOOK.format())
			.build();
	}

	// 연령대 인기 도서 조회
	public RecommendationBookDto getDemographicsBooks(Long memberId) {
		// 1. 유저 정보 조회
		Member member = memberRepository.findById(memberId)
			.orElseThrow(MemberNotFoundException::new);
		String groupId = String.format("%d_%d",
			(LocalDate.now().getYear() - member.getBirth().getYear()) / 10 * 10,
			member.getGender() == Gender.M? 1 : 0);
		String totalGroupId = "Total";
		// 2. 연령대 인기 도서 조회 (mongoDB)
		DemographicsBook demographicsBook = demographicsBookRepository.findByGroupId(groupId);
		if (demographicsBook == null) {
			demographicsBook = demographicsBookRepository.findByGroupId(totalGroupId);
		}
		// 3. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(demographicsBook.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.FAMOUS_BOOK.format())
			.build();
	}

	// entity -> dto 변환
	// Dto 안에 넣으려다 ImageUtil이 있어 Service 단에서 처리
	public List<PublishedBookInfoDto> bookToDto(List<Book> bookList) {
		return bookList.stream().map(book ->
			PublishedBookInfoDto.builder()
				.bookId(book.getBookId())
				.coverAlt(book.getCoverAlt())
				.title(book.getTitle())
				.author(book.getAuthor())
				.publisher(book.getPublisher())
				.story(book.getStory())
				.cover(imageUtil.getFullImageUrl(book.getCover()))
				.build()).toList();
	}

}
