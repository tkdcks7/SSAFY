package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class RegisteredBookNotFoundException extends CustomException {

	private static final long serialVersionUID = 1L;

	public RegisteredBookNotFoundException() {
		super(GlobalExceptionConstants.REGISTERED_BOOK_NOT_FOUND);
	}

}
