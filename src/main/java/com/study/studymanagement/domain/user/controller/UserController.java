package com.study.studymanagement.domain.user.controller;

import static com.study.studymanagement.global.exception.handler.ExceptionCode.*;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.studymanagement.domain.user.dto.UserRequest;
import com.study.studymanagement.domain.user.service.UserService;
import com.study.studymanagement.global.common.ApiResponse;
import com.study.studymanagement.global.exception.exception.UserException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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

	@PostMapping("/login")
	public ApiResponse<?> loginUser(@RequestBody UserRequest.Login request, HttpServletRequest httpRequest) {
		userService.loginUser(request, httpRequest);
		return ApiResponse.success();
	}


	@PostMapping("/logout")
	public ApiResponse<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate();
		}

		SecurityContextHolder.clearContext();

		Cookie cookie = new Cookie("JSESSIONID", null);
		cookie.setPath("/");
		cookie.setMaxAge(0);
		response.addCookie(cookie);

		return ApiResponse.success();
	}

	@PostMapping("/users/loginId")
	public ApiResponse<?> checkLoginId(@RequestBody UserRequest.LoginId request) {
		userService.checkLoginId(request.loginId());
		return ApiResponse.success();
	}


}
