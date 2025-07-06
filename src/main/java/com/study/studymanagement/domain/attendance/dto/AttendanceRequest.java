package com.study.studymanagement.domain.attendance.dto;

public class AttendanceRequest {

	public record SaveTime(String thisDayStudyTimes) {}

	public record ApplyVacation(String leaveRequestDay) {}
}
