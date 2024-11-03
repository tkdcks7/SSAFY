package com.palja.audisay.domain.member.dto;

import com.palja.audisay.domain.member.entity.Gender;
import com.palja.audisay.domain.member.entity.Member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponseDto {
	private String email;
	private String name;
	private String nickname;
	private String birth;
	private Gender gender;
	private boolean blindFlag;

	// Member 엔티티에서 DTO로 변환
	public static MemberResponseDto fromMember(Member member) {
		return MemberResponseDto.builder()
			.email(member.getEmail())
			.name(member.getName())
			.nickname(member.getNickname())
			.birth(member.getBirth().toString())
			.gender(member.getGender())
			.blindFlag(member.isBlindFlag())
			.build();
	}
}
