package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.GlobalExceptionConstants;
import com.palja.audisay.global.exception.InternalServerException;

public class InvalidDatetimeException extends InternalServerException {

	private static final long serialVersionUID = 1L;

	public InvalidDatetimeException() {
		super(GlobalExceptionConstants.INVALID_DATETIME);
	}

}