package com.study.studymanagement.user.entity;

import java.util.ArrayList;
import java.util.List;

import com.study.studymanagement.attendance.entity.Attendance;
import com.study.studymanagement.attendance.entity.AttendanceStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	@Column(unique = true)
	private String loginId;
	private String password;
	@Column(unique = true)
	private String email;
	private Long consecutiveStudyDays;
	private String introduce;
	private String thisMonthStudyTimes;
	private String thisWeekStudyTimes;
	private String thisMonthLeave;

	@Enumerated(EnumType.STRING)
	private AttendanceStatus todayAttendanceStatus;

	@Enumerated(EnumType.STRING)
	private StudyStatus studyStatus;

	@OneToMany(mappedBy = "user")
	private List<Attendance> attendances = new ArrayList<>();
}
