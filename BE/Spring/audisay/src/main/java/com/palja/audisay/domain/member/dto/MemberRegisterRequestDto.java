package com.palja.audisay.domain.member.dto;

import com.palja.audisay.domain.member.annotation.ValidEmail;
import com.palja.audisay.domain.member.annotation.ValidName;
import com.palja.audisay.domain.member.annotation.ValidNickname;
import com.palja.audisay.domain.member.annotation.ValidPassword;
import com.palja.audisay.domain.member.entity.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberRegisterRequestDto {

	@NotBlank
	@ValidEmail
	@Schema(description = "이메일 형식에 맞춰야 함, 중복X", example = "ssafy@gmail.com", defaultValue = "ssafy@gmail.com")
	private String email;

	@NotBlank
	@ValidPassword
	@Schema(description = "영어 대소문자, 숫자, 특수문자 가능, 8자리 이상", example = "ssafyssafy", defaultValue = "ssafyssafy")
	private String password;

	@NotBlank
	@ValidName
	@Schema(description = "특수문자X, 2~18자", example = "이름", defaultValue = "이름")
	private String name;

	@NotBlank
	@ValidNickname
	@Schema(description = "특수문자X, 2~15자", example = "닉네임", defaultValue = "닉네임")
	private String nickname;

	@NotNull
	@Schema(description = "날짜 형식으로", example = "2000-01-01", defaultValue = "2000-01-01")
	private LocalDate birth;

	@NotNull
	@Schema(description = "남자는 'M', 여자는 'F'", example = "M", defaultValue = "M")
	private Gender gender;

	@NotNull
	@Schema(description = "blindFlag", example = "true/false", defaultValue = "true")
	private boolean blindFlag;
}
