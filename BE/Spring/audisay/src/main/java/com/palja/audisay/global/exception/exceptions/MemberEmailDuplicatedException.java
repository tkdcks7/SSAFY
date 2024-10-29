package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class MemberEmailDuplicatedException extends CustomException {

	private static final long serialVersionUID = 1L;

	public MemberEmailDuplicatedException() {
		super(GlobalExceptionConstants.MEMBER_EMAIL_DUPLICATED);
	}

}