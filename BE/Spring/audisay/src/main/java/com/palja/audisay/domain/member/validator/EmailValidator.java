package com.palja.audisay.domain.member.validator;

import com.palja.audisay.domain.member.annotation.ValidEmail;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EmailValidator implements ConstraintValidator<ValidEmail, String> {
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$"; // 이메일 형식에 맞는 정규 표현식 패턴

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return email != null && email.matches(EMAIL_PATTERN); // 정규식을 사용해 형식이 맞으면 true, 아니면 false
    }
}
