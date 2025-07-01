package com.study.studymanagement.domain.attendance.entity.service;

import static com.study.studymanagement.global.exception.handler.ExceptionCode.*;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.studymanagement.domain.attendance.entity.Attendance;
import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;
import com.study.studymanagement.domain.attendance.entity.repository.AttendanceRepository;
import com.study.studymanagement.domain.user.entity.User;
import com.study.studymanagement.domain.user.repository.UserRepository;
import com.study.studymanagement.global.exception.exception.UserException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {

	private final AttendanceRepository attendanceRepository;
	private final UserRepository userRepository;

	@Transactional
	public void changeStatus(String status, String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UserException(INVALID_USER));

		AttendanceStatus attendanceStatus = AttendanceStatus.NO_ATTENDED;

		if (status.equals("attended")) {
			attendanceStatus = AttendanceStatus.ATTENDED;
		} else if (status.equals("absent")) {
			attendanceStatus = AttendanceStatus.ABSENT;
		} else if (status.equals("vacation")) {
			attendanceStatus = AttendanceStatus.VACATION;
		}

		user.changeStatus(attendanceStatus);

		// 연결된 attendances 출석도 변경해주기
		List<Attendance> attendances = user.getAttendances();
		LocalDate today = LocalDate.now();
		for (Attendance attendance : attendances) {
			if (attendance.getDate().equals(today)) {
				attendance.changeAttendanceStatus(attendanceStatus);
				break;
			}
		}

	}
}
