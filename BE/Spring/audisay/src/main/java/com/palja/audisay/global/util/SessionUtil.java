package com.palja.audisay.global.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.palja.audisay.domain.member.service.CustomUserDetails;
import com.palja.audisay.global.exception.exceptions.MemberAccessDeniedException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class SessionUtil {
	// 세션에서 memberId를 가져오는 메서드
	public static Long getMemberId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
			throw new MemberAccessDeniedException();
		}
		return userDetails.getId();
	}

	// 쿠키 삭제 메서드
	public static void clearSessionCookie(HttpServletResponse response) {
		Cookie cookie = new Cookie("JSESSIONID", null);
		cookie.setPath("/");
		cookie.setMaxAge(0); // 쿠키 만료
		cookie.setHttpOnly(true);
		response.addCookie(cookie);
	}
}
