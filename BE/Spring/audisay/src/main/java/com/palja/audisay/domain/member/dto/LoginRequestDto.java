package com.palja.audisay.domain.member.dto;

import com.palja.audisay.domain.member.annotation.ValidEmail;
import com.palja.audisay.domain.member.annotation.ValidPassword;
import io.swagger.v3.oas.annotations.media.Schema;
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
	@Schema(description = "이메일 형식에 맞춰야 함", example = "ssafy@gmail.com", defaultValue = "ssafy@gmail.com")
	private String email;
	@ValidPassword
	@NotBlank
	@Schema(description = "비밀번호는 8자리 이상, 이메일과 비밀번호 일치해야 함", example = "ssafyssafy", defaultValue = "ssafyssafy")
	private String password;
}
