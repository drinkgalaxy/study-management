package com.study.studymanagement.domain.user.dto;

import java.time.Duration;
import java.util.List;

import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;
import com.study.studymanagement.domain.attendance.entity.dto.AttendanceResponse;

public class UserResponse {

	public record MyPage(String name, Long consecutiveStudyDays, String introduce,
						 Duration thisMonthStudyTimes, Long thisMonthLeave) {}

	public record AllUsers(String name, String email, String introduce,
						   Duration thisMonthStudyTimes, AttendanceStatus todayAttendanceStatus) {}

	public record MyAttendance(Long thisMonthAttended, Long thisMonthAbsent, Long thisMonthVacation,
							   List<AttendanceResponse.AttendanceDto> attendances) {}

	public record MyHome(String name, Duration thisMonthStudyTimes, Duration thisWeekStudyTimes) {}

	public record AllStudyingUsers(String name, String email) {}

	public record AttendedUserCount(Long count) {}
}
