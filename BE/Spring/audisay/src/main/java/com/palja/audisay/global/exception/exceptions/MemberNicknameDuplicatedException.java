package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class MemberNicknameDuplicatedException extends CustomException {

	private static final long serialVersionUID = 1L;

	public MemberNicknameDuplicatedException() {
		super(GlobalExceptionConstants.MEMBER_NICKNAME_DUPLICATED);
	}

}