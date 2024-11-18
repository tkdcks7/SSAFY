package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class NoteNotFoundException extends CustomException {

	private static final long serialVersionUID = 1L;

	public NoteNotFoundException() {
		super(GlobalExceptionConstants.NOTE_NOT_FOUND);
	}

}