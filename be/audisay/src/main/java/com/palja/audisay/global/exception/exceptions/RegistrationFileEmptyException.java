package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class RegistrationFileEmptyException extends CustomException {

	private static final long serialVersionUID = 1L;

	public RegistrationFileEmptyException() {
		super(GlobalExceptionConstants.REGISTRATION_FILE_EMPTY);
	}

}