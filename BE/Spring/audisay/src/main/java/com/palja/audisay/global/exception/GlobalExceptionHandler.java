package com.palja.audisay.global.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.palja.audisay.global.exception.exceptions.InsufficientParameterException;
import com.palja.audisay.global.exception.exceptions.MemberInvalidParameterException;
import com.palja.audisay.global.exception.exceptions.MemberNotFoundException;
import com.palja.audisay.global.exception.exceptions.ServerErrorException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	// 커스텀 에러 생성 시 400 에러
	@ExceptionHandler({CustomException.class})
	public ResponseEntity<Map<String, String>> customExceptionHandler(CustomException e) {
		ExceptionConstants ec = e.getConstants();

		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("code", ec.getCode());
		errorResponse.put("message", ec.getMessage());

		// 응답으로 Map과 함께 HttpStatus 반환
		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	// 내부 서버 에러 생성 시 500 에러
	@ExceptionHandler({InternalServerException.class})
	public ResponseEntity<Map<String, String>> InternalServerExceptionHandler(InternalServerException e) {
		ExceptionConstants ec = e.getConstants();

		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("code", ec.getCode());
		errorResponse.put("message", ec.getMessage());

		// 응답으로 Map과 함께 HttpStatus 반환
		return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	// 입력 값 유효성 검증 실패 시
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			String code = error.getCode();
			// 로그 찍기
			log.error("입력 값 유효성 검증 실패: {}", error.getDefaultMessage());
			// 회원가입 특정 애너테이션 코드로 MemberInvalidParameterException 던지기
			if ("ValidEmail".equals(code) || "ValidPassword".equals(code)
				|| "ValidName".equals(code) || "ValidNickname".equals(code)) {
				return customExceptionHandler(new MemberInvalidParameterException());
			}
		}
		// 기본 입력값 검증 오류는 InsufficientParameterException 던지기
		return customExceptionHandler(new InsufficientParameterException());
	}

	// BadCredentialsException -> MemberNotFoundException으로 변환
	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<Map<String, String>> handleBadCredentialsException(BadCredentialsException ex) {
		// MemberNotFoundException을 통해 예외를 변환하여 전달
		return customExceptionHandler(new MemberNotFoundException());
	}

	// 알 수 없는 에러 발생(지정된 에러 제외한 모든 에러 처리)
	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleAllExceptions(Exception ex) {
		log.error("예기치 못한 오류 발생: {}", ex.getMessage(), ex);
		return InternalServerExceptionHandler(new ServerErrorException());
	}

	// 로그인 시 사용하는 CustomUserDetailsService에서 사용자 찾을 수 없는 경우
	@ExceptionHandler(UsernameNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleUsernameNotFoundException(UsernameNotFoundException ex) {
		return customExceptionHandler(new MemberNotFoundException());
	}

	@AllArgsConstructor
	private static class ErrorMessage {
		private String code;
		private String message;
	}
}
