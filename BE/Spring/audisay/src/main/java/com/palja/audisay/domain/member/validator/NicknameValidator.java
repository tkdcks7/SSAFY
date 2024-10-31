package com.palja.audisay.domain.member.validator;

import com.palja.audisay.domain.member.annotation.ValidNickname;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NicknameValidator implements ConstraintValidator<ValidNickname, String> {
    private static final String NICKNAME_PATTERN = "^[가-힣a-zA-Z0-9]{2,15}$";

    @Override
    public boolean isValid(String nickname, ConstraintValidatorContext context) {
        return nickname != null && nickname.matches(NICKNAME_PATTERN);
    }
}
