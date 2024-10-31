package com.palja.audisay.domain.member.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EmailCheckRequestDto {
	@NotBlank
	@Email
	@Schema(description = "이메일 형식에 맞춰야 함, 중복X", example = "ssafy@gmail.com", defaultValue = "ssafy@gmail.com")
	private String email;
}
