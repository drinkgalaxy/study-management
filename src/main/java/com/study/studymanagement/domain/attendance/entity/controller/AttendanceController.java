package com.study.studymanagement.domain.attendance.entity.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.studymanagement.domain.attendance.entity.service.AttendanceService;
import com.study.studymanagement.global.common.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance")
public class AttendanceController {

	private final AttendanceService attendanceService;

	// 그 날의 타이머 데이터 저장

	// 상태 변경
	@PatchMapping("/{status}")
	public ApiResponse<?> changeStatus(@PathVariable String status,
		@AuthenticationPrincipal UserDetails userDetails) {
		attendanceService.changeStatus(status, userDetails.getUsername());
		return ApiResponse.success();
	}
}
