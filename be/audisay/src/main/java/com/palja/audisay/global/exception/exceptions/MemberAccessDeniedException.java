package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class MemberAccessDeniedException extends CustomException {

	private static final long serialVersionUID = 1L;

	public MemberAccessDeniedException() {
		super(GlobalExceptionConstants.MEMBER_ACCESS_DENIED);
	}

}