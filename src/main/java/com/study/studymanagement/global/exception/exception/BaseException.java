package com.study.studymanagement.global.exception.exception;

import com.study.studymanagement.global.exception.handler.ExceptionCode;

public class BaseException extends RuntimeException {
	private final ExceptionCode exceptionCode;

	public BaseException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}

	public BaseException(ExceptionCode exceptionCode, String message) {
		super(message);
		this.exceptionCode = exceptionCode;
	}

	public int getHttpStatus() {
		return this.exceptionCode.getStatus();
	}
}
