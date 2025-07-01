package com.study.studymanagement.global.exception.handler;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExceptionCode {

	INVALID_USER("유저 정보를 찾을 수 없습니다.", NOT_FOUND),

	INVALID_ID("중복되는 로그인 아이디입니다.", BAD_REQUEST),

	LOGIN_FAILED("아이디 또는 비밀번호가 잘못되었습니다.", UNAUTHORIZED),
	INVALID_REQUEST_VALUE("요청 값이 올바르지 않습니다.", BAD_REQUEST),

	;

	private final String message;
	private final HttpStatus status;

	public int getStatus() {
		return status.value();
	}
}
