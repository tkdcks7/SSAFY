package com.palja.audisay.global.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	private final ExceptionConstants constants;

	public CustomException(ExceptionConstants constants) {
		super(constants.getCode());
		this.constants = constants;
	}

}