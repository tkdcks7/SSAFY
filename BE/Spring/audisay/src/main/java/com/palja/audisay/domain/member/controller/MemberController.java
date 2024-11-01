package com.palja.audisay.domain.member.controller;

import com.palja.audisay.domain.member.dto.EmailCheckRequestDto;
import com.palja.audisay.domain.member.dto.MemberRegisterRequestDto;
import com.palja.audisay.domain.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "멤버", description = "회원가입, 회원탈퇴, 유저 정보")
public class MemberController {

	private final MemberService memberService;

	// 회원가입
	@PostMapping
	@Operation(summary = "회원 가입", description = "입력 형식 맞춰서 회원가입 해야 함")
	public ResponseEntity<Void> registerMember(
		@Valid @RequestBody MemberRegisterRequestDto memberRegisterRequestDto) {
		memberService.registerMember(memberRegisterRequestDto);
		return ResponseEntity.ok().build();
	}

	// 이메일 중복 확인
	@PostMapping("/email-check")
	@Operation(summary = "이메일 중복 체크", description = "이메일 중복 체크 로직")
	public ResponseEntity<Void> checkEmailDuplicate(@Valid @RequestBody EmailCheckRequestDto emailCheckRequestDto) {
		memberService.validateDuplicateEmail(emailCheckRequestDto.getEmail());
		return ResponseEntity.ok().build();
	}
}
