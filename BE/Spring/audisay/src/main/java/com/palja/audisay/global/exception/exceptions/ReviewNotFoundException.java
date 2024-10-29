package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class ReviewNotFoundException extends CustomException {

	private static final long serialVersionUID = 1L;

	public ReviewNotFoundException() {
		super(GlobalExceptionConstants.REVIEW_NOT_FOUND);
	}

}