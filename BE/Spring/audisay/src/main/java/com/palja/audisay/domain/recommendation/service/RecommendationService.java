package com.palja.audisay.domain.recommendation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.palja.audisay.domain.book.dto.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.repository.BookRepository;
import com.palja.audisay.domain.member.repository.MemberRepository;
import com.palja.audisay.domain.recommendation.dto.response.RecommendationBookDto;
import com.palja.audisay.domain.recommendation.entity.Criterion;
import com.palja.audisay.domain.recommendation.entity.FamousBook;
import com.palja.audisay.domain.recommendation.repository.CategoryBookRepository;
import com.palja.audisay.domain.recommendation.repository.DemographicsBookRepository;
import com.palja.audisay.domain.recommendation.repository.FamousBookRepository;
import com.palja.audisay.domain.recommendation.repository.SimilarBookRepository;
import com.palja.audisay.domain.recommendation.repository.SimilarMemberBookRepository;
import com.palja.audisay.global.exception.exceptions.RecommendationNotFoundException;
import com.palja.audisay.global.util.ImageUtil;

import lombok.RequiredArgsConstructor;

@Service
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

	public RecommendationBookDto getFamousBooks() {
		// 1. 최신 인기 도서 조회 (mongoDB)
		FamousBook famousBook = famousBookRepository.findFirstByOrderByGroupIdDesc();
		if (famousBook == null) {
			throw new RecommendationNotFoundException();
		}
		// 2. 테마 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(famousBook.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookList.stream().map(book ->
			PublishedBookInfoDto.builder()
				.bookId(book.getBookId())
				.coverAlt(book.getCoverAlt())
				.title(book.getTitle())
				.author(book.getAuthor())
				.publisher(book.getPublisher())
				.story(book.getStory())
				.cover(imageUtil.getFullImageUrl(book.getCover()))
				.build()).toList();

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.FAMOUS_BOOK.format())
			.build();
	}
/*
						"bookId" : 3,
						"cover" : "s3 주소",
						"coverAlt" : "아기돼지가 3마리 있다.",
						"title" : "아기돼지 삼형제",
						"author" : "미상",
						"publisher" : "한빛미디어",
						"story" : "돼지 3마리가 집을 짓는 이야기"
 */
	/*
	// 1. 유저 정보 조회
		Member member = memberRepository.findById(memberId)
			.orElseThrow(MemberNotFoundException::new);
	String groupId = String.format("%d_%d",
			(LocalDate.now().getYear() - member.getBirth().getYear()) / 10 * 10,
			member.getGender() == Gender.M? 1 : 0);
		String totalGroupId = "Total";
	 */
}
