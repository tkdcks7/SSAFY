package com.palja.audisay.domain.member.service;

import com.palja.audisay.domain.member.dto.MemberRegisterRequestDto;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerMember(@Valid MemberRegisterRequestDto memberRegisterRequestDto) {
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
}
