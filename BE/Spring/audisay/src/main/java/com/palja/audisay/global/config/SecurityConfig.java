package com.palja.audisay.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.http.HttpServletResponse;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		// 요청 경로에 따른 접근 권한 설정
		http
			.authorizeHttpRequests((requests) -> requests
				.requestMatchers("/auth/login", "/auth/login-token", "/members", "/members/email-check",
					"/swagger/**",
					"/swagger-ui/**", "/v3/api-docs/**", "auth/test")
				.permitAll() // 로그인, 회원가입, 이메일 중복 체크, swagger는 모두 접근 가능
				.anyRequest()
				.authenticated() // 나머지 요청은 인증 필요
			)
			.logout(logout -> logout
				.logoutUrl("/auth/logout")
				.invalidateHttpSession(true)
				.deleteCookies("JSESSIONID")
				.logoutSuccessHandler((request, response, authentication)
					-> {
					response.setStatus(HttpServletResponse.SC_OK);
				}))
			.csrf(AbstractHttpConfigurer::disable); // CSRF 보호 비활성화;

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
