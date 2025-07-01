package com.study.studymanagement.domain.user.dto;

import java.time.Duration;

import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;

public class UserResponse {

	public record MyPage(String name, Long consecutiveStudyDays, String introduce,
						 Duration thisMonthStudyTimes, Long thisMonthLeave) {
	}

	public record AllUsers(String name, String email, String introduce,
						   Duration thisMonthStudyTimes, AttendanceStatus todayAttendanceStatus) {

	}
}
