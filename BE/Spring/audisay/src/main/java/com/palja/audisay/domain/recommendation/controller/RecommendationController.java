package com.palja.audisay.domain.recommendation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.recommendation.dto.response.RecommendationBookDto;
import com.palja.audisay.domain.recommendation.service.RecommendationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/book-recommendation")
@Tag(name = "추천 도서 조회", description = "추천 도서 목록 API")
public class RecommendationController {
	private final RecommendationService recommendationService;

	@Operation(summary = "인기 도서 조회",
		description = "인기 도서 목록 조회 ")
	@GetMapping("/popular")
	public ResponseEntity<RecommendationBookDto> getPopularBooks() {
		Long memberId = 1L;
		return new ResponseEntity<>(recommendationService.getFamousBooks(), HttpStatus.OK);
	}


	@Operation(summary = "연령대 인기 도서 조회",
		description = "연령대 인기 도서 목록 조회 ")
	@GetMapping("/demographics")
	public ResponseEntity<RecommendationBookDto> getDemographicsPopularBooks() {
		Long memberId = 1L;
		return new ResponseEntity<>(recommendationService.getDemographicsBooks(memberId), HttpStatus.OK);
	}

	@Operation(summary = "카테고리 인기 도서 조회",
		description = "선호 카테고리 인기 도서 목록 조회 ")
	@GetMapping("/favorite-category")
	public ResponseEntity<RecommendationBookDto> getCategoryPopularBooks() {
		Long memberId = 1L;
		return new ResponseEntity<>(recommendationService.getCategoryBooks(memberId), HttpStatus.OK);
	}

	@Operation(summary = "최근 유사 도서 조회",
		description = "가장 최근에 본 도서와 유사한 도서 목록 조회 ")
	@GetMapping("/recent")
	public ResponseEntity<RecommendationBookDto> getSimilarBooks() {
		Long memberId = 1L;
		return new ResponseEntity<>(recommendationService.getSimilarBooks(memberId), HttpStatus.OK);
	}

	@Operation(summary = "유사한 유저 선호 도서 조회",
		description = "유사한 유저 선호 도서 목록 조회 ")
	@GetMapping("/similar-members")
	public ResponseEntity<RecommendationBookDto> getSimilarMemberBooks() {
		Long memberId = 1L;
		return new ResponseEntity<>(recommendationService.getSimilarMemberBooks(memberId), HttpStatus.OK);
	}

}
