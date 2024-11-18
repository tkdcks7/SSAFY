package com.palja.audisay.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberBookAnalysisResponseDto {
	private String nickname;
	private Long cartBookCount;
	private Long likedBookCount;
}
