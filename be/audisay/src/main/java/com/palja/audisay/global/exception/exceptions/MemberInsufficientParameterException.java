package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class MemberInsufficientParameterException extends CustomException {

	private static final long serialVersionUID = 1L;

	public MemberInsufficientParameterException() {
		super(GlobalExceptionConstants.MEMBER_INSUFFICIENT_PARAMETER);
	}

}