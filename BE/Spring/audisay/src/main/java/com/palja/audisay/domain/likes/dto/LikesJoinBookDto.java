package com.palja.audisay.domain.likes.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.palja.audisay.domain.book.entity.DType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class LikesJoinBookDto {
	private Long bookId;
	private String title;
	private String cover;
	private String coverAlt;
	private String category;
	private String author;
	private String publisher;
	private DType dType;
	@JsonIgnore
	private LocalDateTime createdAtLike;
	@JsonIgnore
	private String coverRaw;
}
