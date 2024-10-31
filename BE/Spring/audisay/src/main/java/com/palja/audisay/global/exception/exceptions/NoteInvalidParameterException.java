package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class NoteInvalidParameterException extends CustomException {
	private static final long serialVersionUID = 1L;

	public NoteInvalidParameterException() {
		super(GlobalExceptionConstants.NOTE_INVALID_PARAMETER);
	}

}
