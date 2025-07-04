package com.study.studymanagement.global.exception.exception;

import com.study.studymanagement.global.exception.handler.ExceptionCode;

public class AttandanceException extends BaseException {
	public AttandanceException(ExceptionCode exceptionCode) {
		super(exceptionCode);
	}

	public AttandanceException(ExceptionCode exceptionCode, String message) {
		super(exceptionCode, message);
	}
}
