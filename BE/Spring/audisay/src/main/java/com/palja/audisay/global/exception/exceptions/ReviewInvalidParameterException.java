package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class ReviewInvalidParameterException extends CustomException {

	private static final long serialVersionUID = 1L;

	public ReviewInvalidParameterException() {
		super(GlobalExceptionConstants.REVIEW_INVALID_PARAMETER);
	}

}