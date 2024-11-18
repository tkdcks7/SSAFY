package com.palja.audisay.global.exception.exceptions;

import com.palja.audisay.global.exception.CustomException;
import com.palja.audisay.global.exception.GlobalExceptionConstants;

public class IncorrectPasswordException extends CustomException {
    private static final long serialVersionUID = 1L;

    public IncorrectPasswordException() {
        super(GlobalExceptionConstants.MEMBER_PASSWORD_INCORRECT);
    }
}
