package com.study.studymanagement.domain.attendance.entity.service;

import static com.study.studymanagement.global.exception.handler.ExceptionCode.*;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.studymanagement.domain.attendance.entity.Attendance;
import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;
import com.study.studymanagement.domain.attendance.entity.dto.AttendanceRequest;
import com.study.studymanagement.domain.attendance.entity.repository.AttendanceRepository;
import com.study.studymanagement.domain.user.entity.StudyStatus;
import com.study.studymanagement.domain.user.entity.User;
import com.study.studymanagement.domain.user.repository.UserRepository;
import com.study.studymanagement.global.exception.exception.AttandanceException;
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
			if (user.getTodayAttendanceStatus() != attendanceStatus) {
				user.changeConsecutiveStudyDays(true);
			}
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

	@Transactional
	public void saveTime(AttendanceRequest.SaveTime request, String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UserException(INVALID_USER));

		Duration thisDayStudyTimes = parseStudyTime(request.thisDayStudyTimes());

		Duration thisWeekStudyTimes = user.getThisWeekStudyTimes();
		Duration thisMonthStudyTimes = user.getThisMonthStudyTimes();

		Duration updatedWeek = thisWeekStudyTimes.plus(thisDayStudyTimes);
		Duration updatedMonth = thisMonthStudyTimes.plus(thisDayStudyTimes);

		user.saveTime(updatedWeek, updatedMonth);

	}

	@Transactional
	public void changeStudyStatus(String status, String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UserException(INVALID_USER));

		StudyStatus studyStatus = StudyStatus.PAUSED;

		if (status.equals("studying")) {
			studyStatus = StudyStatus.STUDYING;
		} else if (status.equals("finished")) {
			studyStatus = StudyStatus.FINISHED;
		}

		user.changeStudyStatus(studyStatus);
	}

	@Transactional
	public void applyVacation(AttendanceRequest.ApplyVacation request, String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UserException(INVALID_USER));

		LocalDate requestDate = LocalDate.parse(request.leaveRequestDay());

		boolean exists = attendanceRepository.existsByUserAndDate(user, requestDate);
		if (!exists) {
			Attendance attendance = Attendance.builder()
				.user(user)
				.date(requestDate)
				.attendanceStatus(AttendanceStatus.VACATION)
				.build();
			attendanceRepository.save(attendance);
			user.changeMonthLeave();
		} else {
			Attendance byUserAndDate = attendanceRepository.findByUserAndDate(user, requestDate);
			if (byUserAndDate.getAttendanceStatus() == AttendanceStatus.ATTENDED) {
				throw new AttandanceException(INVALID_DATE_ALREADY_ATTENDED);
			} else if (byUserAndDate.getAttendanceStatus() == AttendanceStatus.ABSENT) {
				throw new AttandanceException(INVALID_DATE_ALREADY_ABSENT);
			} else if (byUserAndDate.getAttendanceStatus() == AttendanceStatus.VACATION) {
				throw new AttandanceException(INVALID_DATE_ALREADY_VACATION);
			}
		}

	}

	private Duration parseStudyTime(String timeStr) {
		String[] parts = timeStr.split("-");
		int hours = Integer.parseInt(parts[0]);
		int minutes = Integer.parseInt(parts[1]);
		int seconds = Integer.parseInt(parts[2]);
		return Duration.ofHours(hours)
			.plusMinutes(minutes)
			.plusSeconds(seconds);
	}


}
