package com.study.studymanagement.domain.user.entity;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import com.study.studymanagement.domain.attendance.entity.Attendance;
import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;

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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
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
	private Duration thisMonthStudyTimes;
	private Duration thisWeekStudyTimes;
	private Long thisMonthLeave;

	@Enumerated(EnumType.STRING)
	private AttendanceStatus todayAttendanceStatus;

	@Enumerated(EnumType.STRING)
	private StudyStatus todayStudyStatus;

	@OneToMany(mappedBy = "user")
	private List<Attendance> attendances = new ArrayList<>();

	public void changeStatus(AttendanceStatus status) {
		this.todayAttendanceStatus = status;
	}

	public void changeIntroduce(String introduce) {
		this.introduce =  introduce;
	}
}
