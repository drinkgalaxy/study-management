package com.study.studymanagement.domain.attendance.entity.dto;

import java.time.LocalDate;

import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;

public class AttendanceResponse {

	public record AttendanceDto(LocalDate date, AttendanceStatus status) {}


}
