package com.palja.audisay.domain.member.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.palja.audisay.domain.member.dto.LoginRequestDto;
import com.palja.audisay.domain.member.dto.MemberRegisterRequestDto;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.repository.MemberRepository;
import com.palja.audisay.global.exception.exceptions.MemberEmailDuplicatedException;
import com.palja.audisay.global.exception.exceptions.MemberNotFoundException;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;

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
		// 멤버 이메일로 있는지 확인
		Member member = memberRepository.findByEmail(loginRequestDto.getEmail())
			.orElseThrow(MemberNotFoundException::new);
		// 비밀번호가 일치하는지 확인
		if (!passwordEncoder.matches(loginRequestDto.getPassword(), member.getPassword())) {
			throw new MemberNotFoundException();
		}
		return member.getMemberId();
	}
}
