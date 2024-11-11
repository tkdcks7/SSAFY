package com.palja.audisay.domain.member.service;

import com.palja.audisay.domain.member.dto.*;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.repository.MemberRepository;
import com.palja.audisay.global.exception.exceptions.MemberAccessDeniedException;
import com.palja.audisay.global.exception.exceptions.MemberEmailDuplicatedException;
import com.palja.audisay.global.exception.exceptions.MemberNotFoundException;
import com.palja.audisay.global.util.StringUtil;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {

	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;

	public MemberResponseDto getMemberInfo(Long memberId) {
		Member member = memberRepository.findByMemberId(memberId).orElseThrow(MemberNotFoundException::new);
		return MemberResponseDto.fromMember(member);
	}

	public MemberBookAnalysisResponseDto getBookAnalysis(Long memberId) {
		return memberRepository.getBookAnalysisByMemberId(memberId);
	}

	@Transactional
	public void registerMember(@Valid MemberRegisterRequestDto memberRegisterRequestDto) {
		// 이메일 중복 확인
		validateDuplicateEmail(memberRegisterRequestDto.getEmail());
		// 비밀번호 인코딩
		String encodedPassword = passwordEncoder.encode(memberRegisterRequestDto.getPassword());
		Member member = memberRegisterRequestDto.toEntity(encodedPassword);
		memberRepository.save(member);
	}

	public void validateDuplicateEmail(String email) {
		if (memberRepository.existsByEmail(email)) {
			throw new MemberEmailDuplicatedException(); // 중복된 이메일 예외 던짐 } }
		}
	}

	public Member validateMember(Long memberId) {
		Member member = memberRepository.findByMemberId(memberId).orElseThrow(MemberNotFoundException::new);
		if (member.isDeleteFlag()) {
			throw new MemberAccessDeniedException();
		}
		return member;
	}

	@Transactional
	public void updateMemberInfo(Long memberId, MemberUpdateRequestDto memberUpdateRequestDto) {
		Member member = memberRepository.findByMemberId(memberId).orElseThrow(MemberNotFoundException::new);

		// nickname이 null이 아닐 때만 닉네임을 업데이트
		if (memberUpdateRequestDto.getNickname() != null) {
			member.setNickname(memberUpdateRequestDto.getNickname());
		}

		member.setBlindFlag(memberUpdateRequestDto.getBlindFlag());
		memberRepository.save(member);
	}

	@Transactional
	public void changePassword(Long memberId, PasswordChangeRequestDto passwordChangeRequestDto) {
		Member member = memberRepository.findByMemberId(memberId).orElseThrow(MemberNotFoundException::new);
		// 기존 비밀번호 확인
		if (!passwordEncoder.matches(passwordChangeRequestDto.getOldPassword(), member.getPassword())) {
			throw new MemberNotFoundException();
		}
		// 새 비밀번호 인코딩 및 저장
		String encodedNewPassword = passwordEncoder.encode(passwordChangeRequestDto.getNewPassword());
		member.setPassword(encodedNewPassword);
		memberRepository.save(member);
	}

	@Transactional
	public void deleteMember(Long memberId) {
		Member member = memberRepository.findByMemberId(memberId).orElseThrow(MemberNotFoundException::new);
		member.setDeleteFlag(true); // delete_flag을 true로 설정
		member.setEmail(hashEmail(member.getEmail())); // 이메일 마스킹
		member.setName(maskName(member.getName())); // 이름 마스킹

		memberRepository.save(member);
	}

	private String hashEmail(String email) {
		String date = StringUtil.datetimeToString(LocalDateTime.now()); // 현재 날짜와 시간을 문자열로 변환
		return passwordEncoder.encode(email + date); // 이메일과 현재 날짜를 결합해서 해시화
	}

	private String maskName(String name) {
		return name.charAt(0) + "*".repeat(name.length() - 1); // 첫 글자만 남기고 나머지 마스킹
	}
}
