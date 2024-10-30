package com.palja.audisay.domain.member.annotation;

import com.palja.audisay.domain.member.validator.NicknameValidator;
import jakarta.validation.Constraint;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = NicknameValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidNickname {
}
