package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class MemberInvalidParameterException extends CustomException {

	private static final long serialVersionUID = 1L;

	public MemberInvalidParameterException() {
		super(GlobalExceptionConstants.MEMBER_INVALID_PARAMETER);
	}

}