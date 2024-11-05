package com.palja.audisay.global.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.palja.audisay.domain.member.entity.Member;
import com.palja.audisay.domain.member.repository.MemberRepository;
import com.palja.audisay.global.exception.exceptions.MemberAccessDeniedException;
import com.palja.audisay.global.exception.exceptions.MemberNotFoundException;
import com.palja.audisay.global.util.SessionUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomMemberValidationFilter extends OncePerRequestFilter {

	private final MemberRepository memberRepository;
	private final ObjectMapper objectMapper; // JSON 변환기
	private static final List<String> EXCLUDED_PATHS = List.of(
		"/auth/login",
		"/auth/logout",
		"/members/email-check",
		"/members",
		"/swagger-ui/**",
		"/swagger/**",
		"/v3/api-docs/**"
	);
	private final PathMatcher pathMatcher = new AntPathMatcher();

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {

		String contextPath = request.getContextPath();
		String requestURI = request.getRequestURI().substring(contextPath.length());

		// 인증이 필요 없는 경로는 검증 없이 다음 필터로 넘김
		if (isExcludedUrl(requestURI)) {
			filterChain.doFilter(request, response);
			return;
		}

		try {
			if (SecurityContextHolder.getContext().getAuthentication() == null) {
				throw new MemberAccessDeniedException();
			}
			// 인증된 사용자라면 세션에서 memberId 가져와 추가 검증
			Long memberId = SessionUtil.getMemberId();
			log.info("memberId: {}", memberId);

			Member member = memberRepository.findByMemberId(memberId).orElseThrow(MemberNotFoundException::new);
			// 삭제된 회원인지 검증
			if (member.isDeleteFlag()) {
				throw new MemberAccessDeniedException();
			}
			// 검증을 통과한 경우 요청을 계속 진행
			filterChain.doFilter(request, response);
		} catch (MemberAccessDeniedException | MemberNotFoundException ex) {
			handleException(response, ex.getConstants().getMessage(), HttpServletResponse.SC_BAD_REQUEST,
				ex.getConstants().getCode());
		} catch (Exception ex) {
			handleException(response, "서버에서 오류가 발생하였습니다.", HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "X001");
		}
	}

	// 예외 발생 시 응답을 직접 작성
	private void handleException(HttpServletResponse response, String message, int status, String errorCode)
		throws IOException {
		response.setStatus(status);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("code", errorCode);
		errorResponse.put("message", message);

		response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
	}

	// 인증이 필요 없는 경로를 정의하는 메서드
	private boolean isExcludedUrl(String url) {
		return EXCLUDED_PATHS.stream().anyMatch(excludedPath -> pathMatcher.match(excludedPath, url));
	}
}
