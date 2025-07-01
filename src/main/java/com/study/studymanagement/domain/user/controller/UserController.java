package com.study.studymanagement.domain.user.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.studymanagement.domain.user.dto.UserRequest;
import com.study.studymanagement.domain.user.service.UserService;
import com.study.studymanagement.global.common.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

	private final UserService userService;

	@PostMapping("/signup")
	public ApiResponse<?> signupUser(@RequestBody UserRequest.Signup request) {
		userService.signupUser(request);
		return ApiResponse.success();
	}


}
