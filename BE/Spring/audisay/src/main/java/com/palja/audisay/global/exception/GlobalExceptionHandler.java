package com.palja.audisay.global.exception;

import com.palja.audisay.global.exception.exceptions.InsufficientParameterException;
import com.palja.audisay.global.exception.exceptions.MemberInvalidParameterException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

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
	public void handleValidationExceptions(MethodArgumentNotValidException ex) {
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			String code = error.getCode();

			// 회원가입 특정 애너테이션 코드로 MemberInvalidParameterException 던지기
			if ("ValidEmail".equals(code) || "ValidPassword".equals(code)
					|| "ValidName".equals(code) || "ValidNickname".equals(code)) {
				throw new MemberInvalidParameterException();
			}
		}
		// 기본 입력값 검증 오류는 InsufficientParameterException 던지기
		throw new InsufficientParameterException();
	}

	@AllArgsConstructor
	private static class ErrorMessage {
		private String code;
		private String message;
	}
}
