package com.palja.audisay.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum GlobalExceptionConstants implements ExceptionConstants {
	// MEMBER
	MEMBER_NOT_FOUND("M001", "사용자를 찾을 수 없습니다."),
	MEMBER_EMAIL_DUPLICATED("M002", "중복된 이메일입니다."),
	MEMBER_NICKNAME_DUPLICATED("M003", "중복된 닉네임입니다."),
	MEMBER_INVALID_PARAMETER("M004", "입력 형식이 잘못되었습니다."),
	MEMBER_ACCESS_DENIED("M005", "페이지에 접근할 수 있는 권한이 없습니다."),
	MEMBER_PASSWORD_INCORRECT("M006", "비밀번호가 일치하지 않습니다."),
	// PUBLISHED BOOK
	PUBLISHED_BOOK_NOT_FOUND("P001", "출판 도서를 찾을 수 없습니다."),
	PUBLISHED_BOOK_DOWNLOAD_FAILED("P002", "다운로드 링크를 생성할 수 없습니다."),
	// BOOK REGISTRAION
	REGISTRATION_FILE_TYPE_INVALID("G001", "파일 형식이 잘못되었습니다."),
	REGISTRATION_FILE_EMPTY("G002", "파일이 비어있습니다."),
	REGISTERED_BOOK_NOT_FOUND("G003", "등록 도서를 찾을 수 없습니다."),
	// REVIEW
	REVIEW_INVALID_PARAMETER("R001", "입력 형식이 잘못되었습니다."),
	REVIEW_NOT_FOUND("R002", "리뷰를 찾을 수 없습니다."),
	REVIEW_BOOK_DUPLICATED("R003", "이미 리뷰를 작성한 책입니다."),
	// NOTE
	NOTE_NOT_FOUND("N001", "독서 노트를 찾을 수 없습니다."),
	NOTE_INVALID_PARAMETER("N002", "입력 형식이 잘못되었습니다."),
	// RECOMMENDATION
	RECOMMENDATION_NOT_FOUND("D001", "추천 결과를 찾을 수 없습니다."),
	// COMMON ERROR
	INSUFFICIENT_PARAMETER("C001", "입력 값이 적절하지 않습니다."),
	INVALID_DATETIME("C002", "날짜 형식이 잘못되었습니다."),
	// SERVER ERROR
	SERVER_ERROR("X001", "서버에서 오류가 발생하였습니다.");
	private final String code;
	private final String message;
}
