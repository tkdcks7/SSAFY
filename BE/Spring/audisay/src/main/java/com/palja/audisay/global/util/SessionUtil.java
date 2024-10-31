package com.palja.audisay.global.util;

import com.palja.audisay.global.exception.exceptions.MemberAccessDeniedException;
import jakarta.servlet.http.HttpSession;

public class SessionUtil {
	// 세션에서 memberId를 가져오는 메서드
	public static Long getMemberIdFromSession(HttpSession session) {
		Long memberId = (Long) session.getAttribute("memberId");

		if (memberId == null) {
			// 로그인되지 않은 사용자면 'M005: 페이지에 접근할 수 있는 권한이 없습니다' 에러 던지기
			throw new MemberAccessDeniedException();
		}
		return memberId;
	}
}
