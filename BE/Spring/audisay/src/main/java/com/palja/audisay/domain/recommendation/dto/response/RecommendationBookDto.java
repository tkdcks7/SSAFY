package com.palja.audisay.domain.recommendation.dto.response;

import java.util.List;

import com.palja.audisay.domain.book.dto.response.PublishedBookInfoDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecommendationBookDto {
	private List<PublishedBookInfoDto> bookList;
	private String criterion;
}


