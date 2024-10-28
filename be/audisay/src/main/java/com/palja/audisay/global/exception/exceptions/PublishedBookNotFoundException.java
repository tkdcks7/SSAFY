package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class PublishedBookNotFoundException extends CustomException {

	private static final long serialVersionUID = 1L;

	public PublishedBookNotFoundException() {
		super(GlobalExceptionConstants.PUBLISHED_BOOK_NOT_FOUND);
	}

}