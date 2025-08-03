package com.study.studymanagement.global.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class ApiResponse<T> {
	public final T data;
	public final boolean success;

	public static <T> ApiResponse<T> ok(T data) {
		return new ApiResponse<>(data, true);
	}

	public static ApiResponse<?> success() {
		return new ApiResponse<>(null, true);
	}
}
