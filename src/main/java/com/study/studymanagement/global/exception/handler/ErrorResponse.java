package com.study.studymanagement.global.exception.handler;

import static com.study.studymanagement.global.exception.handler.ExceptionCode.*;

import com.study.studymanagement.global.exception.exception.BaseException;

public record ErrorResponse(String message) {

	static ErrorResponse from(BaseException exception) {
		return new ErrorResponse(exception.getMessage());
	}

	static ErrorResponse parameter() {
		return new ErrorResponse(INVALID_REQUEST_VALUE.getMessage());
	}
}
