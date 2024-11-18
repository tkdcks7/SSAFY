package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class InsufficientParameterException extends CustomException {

	private static final long serialVersionUID = 1L;

	public InsufficientParameterException() {
		super(GlobalExceptionConstants.INSUFFICIENT_PARAMETER);
	}

}