package com.study.studymanagement.global.exception.exception;

import com.study.studymanagement.global.exception.handler.ExceptionCode;

public class UserException extends BaseException {
	public UserException(ExceptionCode exceptionCode) {
		super(exceptionCode);
	}

	public UserException(ExceptionCode exceptionCode, String message) {
		super(exceptionCode, message);
	}
}
