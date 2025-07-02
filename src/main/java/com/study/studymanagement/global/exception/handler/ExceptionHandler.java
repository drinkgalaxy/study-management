package com.study.studymanagement.global.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.study.studymanagement.global.exception.exception.BaseException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class ExceptionHandler {
	@org.springframework.web.bind.annotation.ExceptionHandler(BaseException.class)
	public ResponseEntity<ErrorResponse> handleBaseException(BaseException exception) {
		log.warn("[Base exception] status : {}, message : {}", exception.getHttpStatus(), exception.getMessage());

		return ResponseEntity.status(exception.getHttpStatus()).body(ErrorResponse.from(exception));
	}

}
