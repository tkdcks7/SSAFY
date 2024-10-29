package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class MemberNotFoundException extends CustomException {

	private static final long serialVersionUID = 1L;

	public MemberNotFoundException() {
		super(GlobalExceptionConstants.MEMBER_NOT_FOUND);
	}

}