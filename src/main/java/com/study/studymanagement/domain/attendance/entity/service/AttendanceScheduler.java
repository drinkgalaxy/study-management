package com.study.studymanagement.domain.attendance.entity.service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.study.studymanagement.domain.attendance.entity.Attendance;
import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;
import com.study.studymanagement.domain.attendance.entity.repository.AttendanceRepository;
import com.study.studymanagement.domain.user.entity.StudyStatus;
import com.study.studymanagement.domain.user.entity.User;
import com.study.studymanagement.domain.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AttendanceScheduler {

	private final UserRepository userRepository;
	private final AttendanceRepository attendanceRepository;

	//@Scheduled(cron = "0 0 0 * * *")
	@Scheduled(cron = "0 30 0 * * *") // 초 분 시 (수동으로 생성-테스트용)
	@Transactional
	public void createTodayAttendanceForAllUsers() {
		List<User> users = userRepository.findAll();
		LocalDate today = LocalDate.now();

		for (User user : users) {
			boolean exists = attendanceRepository.existsByUserAndDate(user, today);
			if (!exists) {
				Attendance attendance = Attendance.builder()
					.user(user)
					.date(today)
					.attendanceStatus(AttendanceStatus.NO_ATTENDED)
					.build();
				user.changeStatus(AttendanceStatus.NO_ATTENDED);
				user.changeStudyStatus(StudyStatus.PAUSED);
				attendanceRepository.save(attendance);
			}
		}
	}

	@Scheduled(cron = "0 0 0 * * MON")  // 매주 월요일 00:00
	@Transactional
	public void resetThisWeekStudyTime() {
		List<User> users = userRepository.findAll();

		for (User user : users) {
			user.resetThisWeekStudyTimes(Duration.ZERO);
		}
	}

	@Scheduled(cron = "0 0 0 1 * *")  // 매월 1일 00:00
	@Transactional
	public void resetThisMonthStudyTime() {
		List<User> users = userRepository.findAll();

		for (User user : users) {
			user.resetThisMonthStudyTimes(Duration.ZERO);
			user.resetThisMonthLeave();
		}
	}

	// 23:59:59 에도 출석 전인 유저는 자동으로 결석 상태 처리
	//@Scheduled(cron = "59 59 23 * * *")  // 매일 23시 59분 59초
	@Scheduled(cron = "0 29 12 * * *") // 초 분 시 (수동으로 생성-테스트용)
	@Transactional
	public void markAbsentIfNotAttended() {
		LocalDate today = LocalDate.now();

		// 오늘 날짜의 출석 중, 아직 출석하지 않은 사람들
		List<Attendance> noAttendanceList = attendanceRepository
			.findAllByDateAndAttendanceStatus(today, AttendanceStatus.NO_ATTENDED);

		for (Attendance attendance : noAttendanceList) {
			attendance.changeAttendanceStatus(AttendanceStatus.ABSENT);
			User user = attendance.getUser();
			user.changeConsecutiveStudyDays(false);
		}
	}

}
