package com.palja.audisay.domain.member.dto;

import java.time.LocalDate;

import com.palja.audisay.domain.member.annotation.ValidEmail;
import com.palja.audisay.domain.member.annotation.ValidName;
import com.palja.audisay.domain.member.annotation.ValidNickname;
import com.palja.audisay.domain.member.annotation.ValidPassword;
import com.palja.audisay.domain.member.entity.Gender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberRegisterRequestDto {

	@NotBlank
	@ValidEmail
	private String email;

	@NotBlank
	@ValidPassword
	private String password;

	@NotBlank
	@ValidName
	private String name;

	@NotBlank
	@ValidNickname
	private String nickname;

	@NotNull
	private LocalDate birth;

	@NotNull
	private Gender gender;

	@NotNull
	private boolean blindFlag;
}
