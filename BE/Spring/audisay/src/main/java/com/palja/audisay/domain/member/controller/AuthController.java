package com.palja.audisay.domain.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.member.dto.LoginRequestDto;
import com.palja.audisay.domain.member.service.MemberService;
import com.palja.audisay.global.util.SessionUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "멤버", description = "로그인, 로그아웃")
public class AuthController {
	private final MemberService memberService;

	// 로그인
	@PostMapping("/login")
	@Operation(summary = "로그인", description = "회원 이메일과 비밀번호 일치해야 함")
	public ResponseEntity<Void> login(@Valid @RequestBody LoginRequestDto loginRequestDto, HttpSession session,
		HttpServletRequest request, HttpServletResponse response) {
		Long memberId = memberService.authenticateUser(loginRequestDto);
		session.setAttribute("memberId", memberId); // userId 세션에 저장
		session.setMaxInactiveInterval(6 * 30 * 24 * 60 * 60); // 세션 6개월 유지

		// 명시적으로 SecurityContext를 세션에 저장
		HttpSessionSecurityContextRepository contextRepository = new HttpSessionSecurityContextRepository();
		contextRepository.saveContext(SecurityContextHolder.getContext(), request, response);
		return ResponseEntity.ok().build();
	}

	// 회원 Id 가져오는 테스트 코드
	@GetMapping("/test")
	@Operation(summary = "memberId를 가져올 수 있는 테스트코드", description = "로그인을 해서 세션에 memberId 있어야 정상 작동됨 - swagger에 자동 저장되어 있음")
	public ResponseEntity<String> someMethod() {
		// 유틸리티 메서드 호출로 memberId 가져오기
		Long memberId = SessionUtil.getMemberId();
		return ResponseEntity.ok("memberId: " + memberId);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpSession session, HttpServletResponse response) {
		session.invalidate(); // 현재 세션 무효화 (삭제)
		// JSESSIONID 쿠키 삭제
		Cookie cookie = new Cookie("JSESSIONID", null);
		cookie.setPath("/");
		cookie.setMaxAge(0); // 쿠키 만료
		cookie.setHttpOnly(true);
		response.addCookie(cookie);
		return ResponseEntity.ok().build();
	}
}
