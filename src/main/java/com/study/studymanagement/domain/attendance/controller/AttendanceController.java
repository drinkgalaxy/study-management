package com.study.studymanagement.domain.attendance.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.studymanagement.domain.attendance.dto.AttendanceRequest;
import com.study.studymanagement.domain.attendance.service.AttendanceService;
import com.study.studymanagement.global.common.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance")
public class AttendanceController {

	private final AttendanceService attendanceService;

	// 그 날의 타이머 데이터 저장
	@PostMapping("/time")
	public ApiResponse<?> saveTime(@RequestBody @Valid AttendanceRequest.SaveTime request,
		@AuthenticationPrincipal UserDetails userDetails) {
		attendanceService.saveTime(request, userDetails.getUsername());
		return ApiResponse.success();
	}

	// 오늘의 출석 상태 변경
	@PatchMapping("/{status}")
	public ApiResponse<?> changeStatus(@PathVariable String status,
		@AuthenticationPrincipal UserDetails userDetails) {
		attendanceService.changeStatus(status, userDetails.getUsername());
		return ApiResponse.success();
	}

	// 오늘의 공부 상태 변경
	@PatchMapping("/study/{status}")
	public ApiResponse<?> changeStudyStatus(@PathVariable String status,
		@AuthenticationPrincipal UserDetails userDetails) {
		attendanceService.changeStudyStatus(status, userDetails.getUsername());
		return ApiResponse.success();
	}

	// 휴가 신청
	@PostMapping("/vacation")
	public ApiResponse<?> applyVacation(@RequestBody AttendanceRequest.ApplyVacation request,
		@AuthenticationPrincipal UserDetails userDetails) {
		attendanceService.applyVacation(request, userDetails.getUsername());
		return ApiResponse.success();
	}
}
