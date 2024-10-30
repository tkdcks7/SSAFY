package com.palja.audisay.domain.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.member.dto.EmailCheckRequestDto;
import com.palja.audisay.domain.member.dto.MemberRegisterRequestDto;
import com.palja.audisay.domain.member.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "멤버", description = "회원가입, 회원탈퇴, 유저 정보")
public class MemberController {

	private final MemberService memberService;

	// 회원가입
	@PostMapping
	@Operation(summary = "회원 가입", description = "입력 형식 맞춰서 회원가입 해야 함")
	@Parameters({
		@Parameter(name = "email", description = "이메일 형식에 맞춰야 함, 중복X", example = "ssafy@gmail.com"),
		@Parameter(name = "password", description = "영어 대소문자, 숫자, 특수문자 가능, 8자리 이상", example = "ssafyssafy"),
		@Parameter(name = "name", description = "특수문자X, 2~18자", example = "이름"),
		@Parameter(name = "nickname", description = "특수문자X, 2~15자", example = "닉네임"),
		@Parameter(name = "birth", description = "날짜 형식으로", example = "2000-01-01"),
		@Parameter(name = "gender", description = "남자는 'M', 여자는 'F'", example = "M"),
		@Parameter(name = "blindFlag", description = "true/false", example = "true")
	})
	public ResponseEntity<Void> registerMember(
		@Valid @RequestBody MemberRegisterRequestDto memberRegisterRequestDto) {
		memberService.registerMember(memberRegisterRequestDto);
		return ResponseEntity.ok().build();
	}

	// 이메일 중복 확인
	@PostMapping("/email-check")
	public ResponseEntity<Void> checkEmailDuplicate(@Valid @RequestBody EmailCheckRequestDto emailCheckRequestDto) {
		memberService.validateDuplicateEmail(emailCheckRequestDto.getEmail());
		return ResponseEntity.ok().build();
	}
}
