package com.palja.audisay.global.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler({CustomException.class})
	public ResponseEntity<Map<String, String>> customExceptionHandler(CustomException e) {
		ExceptionConstants ec = e.getConstants();

		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("code", ec.getCode());
		errorResponse.put("message", ec.getMessage());

		// 응답으로 Map과 함께 HttpStatus 반환
		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	@AllArgsConstructor
	private static class ErrorMessage {
		private String code;
		private String message;
	}
}
