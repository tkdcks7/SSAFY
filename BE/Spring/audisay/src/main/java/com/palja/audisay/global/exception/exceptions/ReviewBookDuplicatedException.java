package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class ReviewBookDuplicatedException extends CustomException {

	private static final long serialVersionUID = 1L;

	public ReviewBookDuplicatedException() {
		super(GlobalExceptionConstants.REVIEW_BOOK_DUPLICATED);
	}

}