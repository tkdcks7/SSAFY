package com.palja.audisay.global.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.palja.audisay.domain.member.service.CustomUserDetails;
import com.palja.audisay.global.exception.exceptions.MemberAccessDeniedException;

public class SessionUtil {
	// 세션에서 memberId를 가져오는 메서드
	public static Long getMemberId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
			throw new MemberAccessDeniedException();
		}
		return userDetails.getId();
	}
}
