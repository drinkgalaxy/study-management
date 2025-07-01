package com.study.studymanagement.domain.user.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.studymanagement.domain.user.dto.UserRequest;
import com.study.studymanagement.domain.user.dto.UserResponse;
import com.study.studymanagement.domain.user.service.UserService;
import com.study.studymanagement.global.common.ApiResponse;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

	private final UserService userService;

	@PostMapping("/signup")
	public ApiResponse<?> signupUser(@RequestBody @Valid UserRequest.Signup request) {
		userService.signupUser(request);
		return ApiResponse.success();
	}

	@PostMapping("/login")
	public ApiResponse<?> loginUser(@RequestBody @Valid UserRequest.Login request, HttpServletRequest httpRequest) {
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

	// 아이디 중복 검사
	@PostMapping("/users/loginId")
	public ApiResponse<?> checkLoginId(@RequestBody @Valid UserRequest.LoginId request) {
		userService.checkLoginId(request.loginId());
		return ApiResponse.success();
	}

	// 로그인 한 유저 마이 페이지 정보 조회
	@GetMapping("/users/my")
	public ApiResponse<UserResponse.MyPage> getMyPageInfo(@AuthenticationPrincipal UserDetails userDetails) {
		return ApiResponse.ok(userService.getMyPageInfo(userDetails.getUsername()));
	}

	// 로그인 한 유저 마이 페이지 출석 조회
	@GetMapping("/users/{month}/attendances")
	public ApiResponse<List<UserResponse.MyAttendance>> getMyAttendanceInfo(@PathVariable String month,
		@AuthenticationPrincipal UserDetails userDetails) {
		return ApiResponse.ok(userService.getMyAttendanceInfo(month, userDetails.getUsername()));
	}

	// 전체 유저 정보 조회
	@GetMapping("/users")
	public ApiResponse<List<UserResponse.AllUsers>> getAllUsers() {
		return ApiResponse.ok(userService.getAllUsers());
	}


}
