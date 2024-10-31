package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class InvalidDatetimeException extends CustomException {

	private static final long serialVersionUID = 1L;

	public InvalidDatetimeException() {
		super(GlobalExceptionConstants.INVALID_DATETIME);
	}

}