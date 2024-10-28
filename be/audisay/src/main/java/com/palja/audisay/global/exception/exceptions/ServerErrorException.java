package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class ServerErrorException extends CustomException {

	private static final long serialVersionUID = 1L;

	public ServerErrorException() {
		super(GlobalExceptionConstants.SERVER_ERROR);
	}

}