package com.palja.audisay.domain.member.validator;

import com.palja.audisay.domain.member.annotation.ValidName;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NameValidator implements ConstraintValidator<ValidName, String> {
    private static final String NAME_PATTERN = "^[가-힣a-zA-Z]{2,18}$";

    @Override
    public boolean isValid(String name, ConstraintValidatorContext context) {
        return name != null && name.matches(NAME_PATTERN);
    }
}
