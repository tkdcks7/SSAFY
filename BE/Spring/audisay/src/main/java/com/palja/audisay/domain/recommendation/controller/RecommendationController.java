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
}
