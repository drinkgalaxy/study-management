package com.study.studymanagement.domain.attendance.entity.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.study.studymanagement.domain.attendance.entity.Attendance;
import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;
import com.study.studymanagement.domain.attendance.entity.repository.AttendanceRepository;
import com.study.studymanagement.domain.user.entity.User;
import com.study.studymanagement.domain.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AttendanceScheduler {

	private final UserRepository userRepository;
	private final AttendanceRepository attendanceRepository;


	// 매일 00시마다 모든 유저들 그 날짜에 대한 출석 데이터 생성
	//@Scheduled(cron = "0 0 0 * * *")
	@Scheduled(cron = "0 38 1 * * *") // 매일 오후 11시 29분 (테스트용)
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
				attendanceRepository.save(attendance);
			}
		}
	}
}
