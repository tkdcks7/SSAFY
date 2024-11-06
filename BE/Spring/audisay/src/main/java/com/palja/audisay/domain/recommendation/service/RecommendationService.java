package com.palja.audisay.domain.recommendation.service;

import java.util.ArrayList;
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
import com.palja.audisay.domain.recommendation.entity.Criterion;
import com.palja.audisay.domain.recommendation.entity.RecommendationLong;
import com.palja.audisay.domain.recommendation.entity.RecommendationString;
import com.palja.audisay.domain.recommendation.repository.RecommendationLongRepository;
import com.palja.audisay.domain.recommendation.repository.RecommendationStringRepository;
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
	private final RecommendationLongRepository recommendationLongRepository;
	private final RecommendationStringRepository recommendationStringRepository;
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
		RecommendationLong recommendation = recommendationLongRepository.findFamousFirstOrderByGroupIdDesc();
		if (recommendation == null) {
			throw new RecommendationNotFoundException();
		}
		System.out.println("recommendation.getBookList() = " + recommendation.getBookList());
		// 2. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(recommendation.getBookList());
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
		RecommendationString recommendation = recommendationStringRepository.findByrTypeAndTargetId(
				Criterion.DEMOGRAPHICS_BOOK.getType(), groupId)
			.orElseGet(() -> recommendationStringRepository
				.findByrTypeAndTargetId(Criterion.DEMOGRAPHICS_BOOK.getType(), totalGroupId)
				.orElseThrow(RecommendationNotFoundException::new));
		// 3. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(recommendation.getBookList());
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
		// 2. 카테고리 인기 도서 조회 (MongoDB)
		RecommendationString recommendation = recommendationStringRepository.findByrTypeAndTargetId(
				Criterion.CATEGORY_BOOK.getType(),
				category.getCategoryId())
			.orElseThrow(RecommendationNotFoundException::new);
		// 3. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(recommendation.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.CATEGORY_BOOK.format(category.getCategoryName()))
			.build();
	}

	// 최근 조회 도서 인기 도서
	public RecommendationBookDto getSimilarBooks(Long memberId) {
		// 1. 최근 조회 도서 조회
		List<ViewLog> viewLogList = viewLogRepository.findLatestLogByMemberId(memberId, PageRequest.of(0, 1))
			.getContent();
		if (viewLogList.isEmpty()) {
			return RecommendationBookDto.builder()
				.bookList(new ArrayList<>())
				.criterion(Criterion.SIMILAR_BOOK.format(""))
				.build();
		}
		ViewLog viewLog = viewLogList.getFirst();

		// 2. 유사 인기 도서 조회 (MongoDB)
		RecommendationLong recommendation = recommendationLongRepository.findByrTypeAndTargetId(
				Criterion.SIMILAR_BOOK.getType(), viewLog.getBookId())
			.orElseThrow(RecommendationNotFoundException::new);
		// 3. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(recommendation.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.SIMILAR_BOOK.format(viewLog.getTitle()))
			.build();
	}

	// 유사유저 선호 도서
	public RecommendationBookDto getSimilarMemberBooks(Long memberId) {
		// 1. 유사 유저 인기 도서 조회 (MongoDB)
		RecommendationLong recommendation = recommendationLongRepository.findByrTypeAndTargetId(
				Criterion.SIMILAR_MEMBER_BOOK.getType(), memberId)
			.orElseThrow(RecommendationNotFoundException::new);
		// 2. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(recommendation.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.SIMILAR_MEMBER_BOOK.format())
			.build();
	}

	public RecommendationBookDto getSimilarBookByContext(Long bookId) {
		// 1. 유사 도서 조회 (MongoDB)
		RecommendationLong recommendation = recommendationLongRepository.findByrTypeAndTargetId(
				Criterion.SIMILAR_BOOK_BY_CONTEXT.getType(), bookId)
			.orElseThrow(RecommendationNotFoundException::new);
		// 2. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(recommendation.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.SIMILAR_BOOK_BY_CONTEXT.format())
			.build();
	}

	public RecommendationBookDto getSimilarBookByLikes(Long bookId) {
		// 1. 유사 평가 도서 조회 (MongoDB)
		RecommendationLong recommendation = recommendationLongRepository.findByrTypeAndTargetId(
				Criterion.SIMILAR_BOOK_BY_LIKES.getType(), bookId)
			.orElseThrow(RecommendationNotFoundException::new);
		// 2. 도서 상세 정보 조회
		List<Book> bookList = bookRepository.findByBookIdIn(recommendation.getBookList());
		List<PublishedBookInfoDto> publishedBookInfoDtoList = bookToDto(bookList);

		return RecommendationBookDto.builder()
			.bookList(publishedBookInfoDtoList)
			.criterion(Criterion.SIMILAR_BOOK_BY_LIKES.format())
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
