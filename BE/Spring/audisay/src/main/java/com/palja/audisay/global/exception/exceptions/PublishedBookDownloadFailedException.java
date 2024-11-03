package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class PublishedBookDownloadFailedException extends CustomException {

	private static final long serialVersionUID = 1L;

	public PublishedBookDownloadFailedException() {
		super(GlobalExceptionConstants.PUBLISHED_BOOK_DOWNLOAD_FAILED);
	}

}