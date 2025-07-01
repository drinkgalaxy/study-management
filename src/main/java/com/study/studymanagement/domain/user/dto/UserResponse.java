package com.study.studymanagement.domain.user.dto;

import java.time.Duration;

public class UserResponse {

	public record MyPage(String name, Long consecutiveStudyDays, String introduce,
						 Duration thisMonthStudyTimes, Long thisMonthLeave) {
	}
}
