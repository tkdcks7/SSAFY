package com.palja.audisay.global.util;

import com.palja.audisay.domain.member.auth.CustomUserDetails;
import com.palja.audisay.global.exception.exceptions.MemberAccessDeniedException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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
	public static void clearSessionCookie(HttpServletRequest request, HttpServletResponse response) {
		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				// SESSION 쿠키가 있을 때만 삭제
				if ("SESSION".equals(cookie.getName())) {
					cookie = new Cookie("SESSION", null);
					cookie.setPath("/");
					cookie.setMaxAge(0); // 쿠키 만료
					cookie.setHttpOnly(true);
					response.addCookie(cookie);
					break;
				}
			}
		}
	}
}
