package com.palja.audisay.domain.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.member.dto.LoginRequestDto;
import com.palja.audisay.domain.member.service.MemberService;
import com.palja.audisay.global.util.SessionUtil;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
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
	public ResponseEntity<Void> login(@Valid @RequestBody LoginRequestDto loginRequestDto, HttpSession session) {
		Long userId = memberService.authenticateUser(loginRequestDto);
		session.setAttribute("userId", userId); // userId 세션에 저장
		session.setMaxInactiveInterval(6 * 30 * 24 * 60 * 60); // 세션 6개월 유지
		return ResponseEntity.ok().build();
	}

	@GetMapping("/test")
	public ResponseEntity<String> someMethod(HttpSession session) {
		Long userId = SessionUtil.getUserIdFromSession(session); // 유틸리티 메서드 호출로 userId 가져오기

		// userId를 이용해 비즈니스 로직 처리
		return ResponseEntity.ok("userId: " + userId);
	}

	// 로그아웃
	@GetMapping("/logout")
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
