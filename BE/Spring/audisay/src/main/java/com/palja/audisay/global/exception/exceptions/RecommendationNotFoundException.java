package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class RecommendationNotFoundException extends CustomException {

	private static final long serialVersionUID = 1L;

	public RecommendationNotFoundException() {
		super(GlobalExceptionConstants.RECOMMENDATION_NOT_FOUND);
	}

}