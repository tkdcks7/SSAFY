package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.GlobalExceptionConstants;
import com.palja.audisay.global.exception.InternalServerException;

public class ServerErrorException extends InternalServerException {

	private static final long serialVersionUID = 1L;

	public ServerErrorException() {
		super(GlobalExceptionConstants.SERVER_ERROR);
	}

}