package com.palja.audisay.domain.member.service;

import com.palja.audisay.domain.member.dto.LoginRequestDto;
import com.palja.audisay.domain.member.dto.MemberRegisterRequestDto;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.repository.MemberRepository;
import com.palja.audisay.global.exception.exceptions.MemberEmailDuplicatedException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {

	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;

	@Transactional
	public void registerMember(@Valid MemberRegisterRequestDto memberRegisterRequestDto) {
		// 이메일 중복 확인
		validateDuplicateEmail(memberRegisterRequestDto.getEmail());

		Member member = Member.builder()
			.email(memberRegisterRequestDto.getEmail())
			.password(passwordEncoder.encode(memberRegisterRequestDto.getPassword())) // 비밀번호 암호화
			.name(memberRegisterRequestDto.getName())
			.nickname(memberRegisterRequestDto.getNickname())
			.birth(memberRegisterRequestDto.getBirth())
			.gender(memberRegisterRequestDto.getGender())
			.blindFlag(memberRegisterRequestDto.isBlindFlag())
			.build();
		memberRepository.save(member);
	}

	public void validateDuplicateEmail(String email) {
		if (memberRepository.existsByEmail(email)) {
			throw new MemberEmailDuplicatedException(); // 중복된 이메일 예외 던짐 } }
		}
	}

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
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		return userDetails.getId();
	}
}
