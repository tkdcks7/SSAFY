package com.palja.audisay.domain.member.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.palja.audisay.domain.member.validator.NicknameValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = NicknameValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidNickname {
	String message() default "유효한 닉네임 형식이어야 합니다."; // 검증 실패 시 표시할 메시지

	Class<?>[] groups() default {}; // 기본값으로 빈 배열 설정

	Class<? extends Payload>[] payload() default {}; // 기본값으로 빈 배열 설정
}
