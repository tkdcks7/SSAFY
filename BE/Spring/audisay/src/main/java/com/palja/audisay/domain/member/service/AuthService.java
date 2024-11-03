package com.palja.audisay.domain.member.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.palja.audisay.domain.member.dto.LoginRequestDto;
import com.palja.audisay.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final MemberService memberService;

	public Long authenticateUser(LoginRequestDto loginRequestDto) {
		// UsernamePasswordAuthenticationToken 생성
		UsernamePasswordAuthenticationToken authToken =
			new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword());

		// AuthenticationManager에 전달하여 인증 수행
		Authentication authentication = authenticationManager.authenticate(authToken);

		// 인증된 Authentication 객체를 SecurityContext에 저장
		SecurityContextHolder.getContext().setAuthentication(authentication);
		log.info("Authentication 저장 details: {}", authentication);

		// SecurityContext에서 CustomUserDetails를 통해 memberId 추출
		CustomUserDetails userDetails = (CustomUserDetails)authentication.getPrincipal();
		return userDetails.getId();
	}
}
