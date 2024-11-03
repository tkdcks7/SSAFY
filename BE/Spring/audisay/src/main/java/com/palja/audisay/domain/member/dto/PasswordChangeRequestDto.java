package com.palja.audisay.domain.member.dto;

import com.palja.audisay.domain.member.annotation.ValidPassword;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PasswordChangeRequestDto {
	@NotBlank
	@Schema(description = "기존 비밀번호", example = "ssafyssafy")
	private String oldPassword;

	@NotBlank
	@ValidPassword
	@Schema(description = "새로운 비밀번호는 8자리 이상, 영어 대소문자, 숫자, 특수문자 포함", example = "ssafyssafy1")
	private String newPassword;
}
