package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.GlobalExceptionConstants;
import com.palja.audisay.global.exception.InternalServerException;

public class PublishedBookDownloadFailedException extends InternalServerException {

	private static final long serialVersionUID = 1L;

	public PublishedBookDownloadFailedException() {
		super(GlobalExceptionConstants.PUBLISHED_BOOK_DOWNLOAD_FAILED);
	}

}