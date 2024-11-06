package com.palja.audisay.domain.member.controller;

import com.palja.audisay.domain.member.dto.*;
import com.palja.audisay.domain.member.service.MemberService;
import com.palja.audisay.global.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "회원가입, 유저정보", description = "회원가입, 유저 정보 조회/수정")
public class MemberController {

	private final MemberService memberService;

	// 유저 정보 조회
	@GetMapping
	@Operation(summary = "유저 정보 조회", description = "현재 로그인한 유저의 정보를 조회")
	public ResponseEntity<MemberResponseDto> getMemberInfo() {
		Long memberId = SessionUtil.getMemberId();
		MemberResponseDto memberInfo = memberService.getMemberInfo(memberId);
		return ResponseEntity.ok(memberInfo);
	}

	// 유저 독서 정보 조회
	@GetMapping("/book-analysis")
	@Operation(summary = "유저 독서 정보 조회", description = "현재 로그인한 유저의 담은 도서, 등록 도서 정보를 조회")
	public ResponseEntity<MemberBookAnalysisResponseDto> getBookAnalysis() {
		Long memberId = SessionUtil.getMemberId();
		MemberBookAnalysisResponseDto response = memberService.getBookAnalysis(memberId);
		return ResponseEntity.ok(response);
	}

	// 회원가입
	@PostMapping
	@Operation(summary = "회원 가입", description = "입력 형식 맞춰서 회원가입 해야 함")
	public ResponseEntity<Void> registerMember(
		@Valid @RequestBody MemberRegisterRequestDto memberRegisterRequestDto) {
		memberService.registerMember(memberRegisterRequestDto);
		return ResponseEntity.ok().build();
	}

	// 회원 정보 수정(닉네임, 장애 여부)
	@PatchMapping
	@Operation(summary = "회원 정보 수정", description = "닉네임과 시각장애 여부 수정")
	public ResponseEntity<Void> updateMemberInfo(@Valid @RequestBody MemberUpdateRequestDto memberUpdateRequestDto) {
		Long memberId = SessionUtil.getMemberId();
		memberService.updateMemberInfo(memberId, memberUpdateRequestDto);
		return ResponseEntity.ok().build();
	}

	// 비밀번호 변경
	@PatchMapping("/password-change")
	@Operation(summary = "비밀번호 변경", description = "기존 비밀번호 일치 확인 후 새 비밀번호 설정")
	public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordChangeRequestDto passwordChangeRequestDto) {
		Long memberId = SessionUtil.getMemberId();
		memberService.changePassword(memberId, passwordChangeRequestDto);
		return ResponseEntity.ok().build();
	}

	// 이메일 중복 확인
	@PostMapping("/email-check")
	@Operation(summary = "이메일 중복 체크", description = "이메일 중복 체크 로직")
	public ResponseEntity<Void> checkEmailDuplicate(@Valid @RequestBody EmailCheckRequestDto emailCheckRequestDto) {
		memberService.validateDuplicateEmail(emailCheckRequestDto.getEmail());
		return ResponseEntity.ok().build();
	}

	@DeleteMapping
	@Operation(summary = "회원 탈퇴", description = "현재 세션 삭제, 이메일과 이름 마스킹 처리")
	public ResponseEntity<Void> deleteMember(HttpSession session, HttpServletRequest request, HttpServletResponse response) {
		Long memberId = SessionUtil.getMemberId();
		memberService.deleteMember(memberId);
		session.invalidate(); //  현재 세션 무효화 (삭제)
		SessionUtil.clearSessionCookie(request, response); // JSESSIONID 쿠키 삭제
		return ResponseEntity.ok().build();
	}
}
