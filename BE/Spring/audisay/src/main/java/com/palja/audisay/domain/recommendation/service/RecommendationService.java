package com.palja.audisay.domain.recommendation.service;

import java.util.List;

import org.joda.time.LocalDate;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.palja.audisay.domain.book.dto.response.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.repository.BookRepository;
import com.palja.audisay.domain.cart.repository.CustomCartRepository;
import com.palja.audisay.domain.category.entity.Category;
import com.palja.audisay.domain.member.entity.Gender;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.repository.MemberRepository;
import com.palja.audisay.domain.member.service.MemberService;
import com.palja.audisay.domain.recommendation.dto.response.RecommendationBookDto;
import com.palja.audisay.domain.recommendation.entity.CategoryBook;
import com.palja.audisay.domain.recommendation.entity.Criterion;
import com.palja.audisay.domain.recommendation.entity.DemographicsBook;
import com.palja.audisay.domain.recommendation.entity.FamousBook;
import com.palja.audisay.domain.recommendation.entity.SimilarBook;
import com.palja.audisay.domain.recommendation.entity.SimilarMemberBook;
import com.palja.audisay.domain.recommendation.repository.CategoryBookRepository;
import com.palja.audisay.domain.recommendation.repository.DemographicsBookRepository;
import com.palja.audisay.domain.recommendation.repository.FamousBookRepository;
import com.palja.audisay.domain.recommendation.repository.SimilarBookRepository;
import com.palja.audisay.domain.recommendation.repository.SimilarMemberBookRepository;
import com.palja.audisay.domain.viewLog.entity.ViewLog;
import com.palja.audisay.domain.viewLog.repository.ViewLogRepository;
import com.palja.audisay.global.exception.exceptions.RecommendationNotFoundException;
import com.palja.audisay.global.util.ImageUtil;

import jakarta.transaction.Transactional;
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
	// ViewLog
	private final ViewLogRepository viewLogRepository;
	private final CustomCartRepository customCartRepository;

	// memberservice
	private final MemberService memberService;

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
		Member member = memberService.validateMember(memberId);
		int ageGroup = (LocalDate.now().getYear() - member.getBirth().getYear()) / 10 * 10;
		String groupId = String.format("%d_%d", ageGroup,
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
			.criterion(Criterion.DEMOGRAPHICS_BOOK.format(
				String.format("%d대 %s", ageGroup, member.getGender() == Gender.M ? "남성" : "여성")))
			.build();
	}

	// 카테고리 인기 도서
	public RecommendationBookDto getCategoryBooks(Long memberId) {
		// 1. 유저 선호 카테고리 정보 조회
		Category category = customCartRepository.findCategoryByMemberIdAndBookCartCount(memberId)
			.orElseThrow(RecommendationNotFoundException::new);
		System.out.println("category.getCategoryId() = " + category.getCategoryId());
		// 2. 카테고리 인기 도서 조회 (MongoDB)
		CategoryBook categoryBook = categoryBookRepository.findByGroupId(category.getCategoryId())
			.orElseThrow(RecommendationNotFoundException::new);
		// 3. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(categoryBook.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.CATEGORY_BOOK.format(category.getCategoryName()))
			.build();
	}

	// 최근 조회 도서 인기 도서
	public RecommendationBookDto getSimilarBooks(Long memberId) {
		// 1. 최근 조회 도서 조회
		ViewLog viewLog = viewLogRepository.findLatestLogByMemberId(memberId, PageRequest.of(0, 1))
			.getContent()
			.getFirst();
		System.out.println("viewLog.getBookId() = " + viewLog.getBookId());
		// 2. 유사 인기 도서 조회 (MongoDB)
		SimilarBook similarBook = similarBookRepository.findByBookId(viewLog.getBookId())
			.orElseThrow(RecommendationNotFoundException::new);
		// 3. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(similarBook.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.SIMILAR_BOOK.format(viewLog.getTitle()))
			.build();
	}

	// 유사유저 선호 도서
	public RecommendationBookDto getSimilarMemberBooks(Long memberId) {
		// 1. 유사 유저 인기 도서 조회 (MongoDB)
		SimilarMemberBook similarMemberBook = similarMemberBookRepository.findByMemberId(memberId)
			.orElseThrow(RecommendationNotFoundException::new);
		// 2. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(similarMemberBook.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.SIMILAR_MEMBER_BOOK.format())
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
