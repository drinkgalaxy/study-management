package com.study.studymanagement.domain.user.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	// 아이디 중복 검사
	@PostMapping("/loginId")
	public ApiResponse<?> checkLoginId(@RequestBody @Valid UserRequest.LoginId request) {
		userService.checkLoginId(request.loginId());
		return ApiResponse.success();
	}

	// 로그인한 유저 마이 페이지 정보 조회
	@GetMapping("/my")
	public ApiResponse<UserResponse.MyPage> getMyPageInfo(@AuthenticationPrincipal UserDetails userDetails) {
		return ApiResponse.ok(userService.getMyPageInfo(userDetails.getUsername()));
	}

	// 로그인한 유저 마이 페이지 출석 조회
	@GetMapping("/{month}/attendances")
	public ApiResponse<List<UserResponse.MyAttendance>> getMyAttendanceInfo(@PathVariable String month,
		@AuthenticationPrincipal UserDetails userDetails) {
		return ApiResponse.ok(userService.getMyAttendanceInfo(month, userDetails.getUsername()));
	}

	// 로그인한 유저 홈 정보 조회
	@GetMapping("/home")
	public ApiResponse<UserResponse.MyHome> getHomeInfo(@AuthenticationPrincipal UserDetails userDetails) {
		return ApiResponse.ok(userService.getHomeInfo(userDetails.getUsername()));
	}

	// 전체 유저 정보 조회
	@GetMapping
	public ApiResponse<List<UserResponse.AllUsers>> getAllUsers() {
		return ApiResponse.ok(userService.getAllUsers());
	}

	// 공부 중인 유저 목록 조회
	@GetMapping("/count/studying")
	public ApiResponse<List<UserResponse.AllStudyingUsers>> getAllStudyingUsers() {
		return ApiResponse.ok(userService.getAllStudyingUsers());
	}



}
