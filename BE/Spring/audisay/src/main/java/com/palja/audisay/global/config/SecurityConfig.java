package com.palja.audisay.global.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		// 요청 경로에 따른 접근 권한 설정
		http
				.csrf(AbstractHttpConfigurer::disable) // CSRF 보호 비활성화
				.securityContext((securityContext) -> {
					SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
					securityContext
							.securityContextRepository(securityContextRepository)
							.requireExplicitSave(true);
				})
				.authorizeHttpRequests(requests -> requests
						.anyRequest().permitAll() // 모든 요청 허용
				)
//			.authorizeHttpRequests((requests) -> requests
//				.requestMatchers("/auth/login", "/members", "/members/email-check",
//					"/swagger/**","/swagger-ui/**", "/v3/api-docs/**")
//				.permitAll() // 로그인, 회원가입, 이메일 중복 체크, swagger는 모두 접근 가능
//				.anyRequest()
//				.authenticated() // 나머지 요청은 인증 필요
//			)
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 필요 시 세션 생성
			)
				.logout(logout -> logout
						.logoutUrl("/auth/logout")  // 로그아웃 엔드포인트 설정
						.invalidateHttpSession(true)  // 세션 무효화
						.deleteCookies("JSESSIONID")  // JSESSIONID 쿠키 삭제
						.logoutSuccessHandler((request, response, authentication) -> {
							response.setStatus(HttpServletResponse.SC_OK);
						})
				);


		return http.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
