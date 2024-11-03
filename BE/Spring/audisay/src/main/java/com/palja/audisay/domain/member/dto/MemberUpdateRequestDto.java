package com.palja.audisay.domain.member.dto;

import com.palja.audisay.domain.member.annotation.ValidNickname;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemberUpdateRequestDto {
	@ValidNickname
	@Schema(description = "특수문자X, 2~15자", example = "닉네임2", defaultValue = "닉네임2")
	private String nickname;

	@NotNull
	@Schema(description = "blindFlag", example = "true/false", defaultValue = "true")
	private Boolean blindFlag;
}
