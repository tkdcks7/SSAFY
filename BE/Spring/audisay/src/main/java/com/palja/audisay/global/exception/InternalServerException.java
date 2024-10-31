package com.palja.audisay.global.exception;

import lombok.Getter;

@Getter
public class InternalServerException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private final ExceptionConstants constants;

    public InternalServerException(ExceptionConstants constants) {
        super(constants.getCode());
        this.constants = constants;
    }

}