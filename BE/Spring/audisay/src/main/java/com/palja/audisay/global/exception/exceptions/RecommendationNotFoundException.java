package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.GlobalExceptionConstants;
import com.palja.audisay.global.exception.InternalServerException;

public class RecommendationNotFoundException extends InternalServerException {

	private static final long serialVersionUID = 1L;

	public RecommendationNotFoundException() {
		super(GlobalExceptionConstants.RECOMMENDATION_NOT_FOUND);
	}

}