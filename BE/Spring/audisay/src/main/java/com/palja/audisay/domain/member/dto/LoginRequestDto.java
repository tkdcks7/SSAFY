package com.palja.audisay.domain.member.dto;

import com.palja.audisay.domain.member.annotation.ValidEmail;
import com.palja.audisay.domain.member.annotation.ValidPassword;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequestDto {
	@ValidEmail
	@NotBlank
	private String email;
	@ValidPassword
	@NotBlank
	private String password;
}
