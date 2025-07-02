package com.study.studymanagement.domain.user.service;

import static com.study.studymanagement.global.exception.handler.ExceptionCode.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.studymanagement.domain.attendance.entity.Attendance;
import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;
import com.study.studymanagement.domain.attendance.entity.dto.AttendanceResponse;
import com.study.studymanagement.domain.user.dto.UserRequest;
import com.study.studymanagement.domain.user.dto.UserResponse;
import com.study.studymanagement.domain.user.entity.StudyStatus;
import com.study.studymanagement.domain.user.entity.User;
import com.study.studymanagement.domain.user.repository.UserRepository;
import com.study.studymanagement.global.exception.exception.UserException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public void checkLoginId(String loginId) {
		if (userRepository.findByLoginId(loginId).isPresent()) {
			throw new UserException(INVALID_ID);
		}
	}

	public UserResponse.MyPage getMyPageInfo(String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UserException(INVALID_USER));

		return new UserResponse.MyPage(
			user.getName(),
			user.getConsecutiveStudyDays(),
			user.getIntroduce(),
			user.getThisMonthStudyTimes(),
			user.getThisMonthLeave()
		);
	}

	@Transactional(readOnly = true)
	public List<UserResponse.AllUsers> getAllUsers() {
		List<User> user = userRepository.findAll();

		List<UserResponse.AllUsers> allUsersList = new ArrayList<>();

		for (User users : user) {
			allUsersList.add(new UserResponse.AllUsers(
				users.getName(),
				users.getEmail(),
				users.getIntroduce(),
				users.getThisMonthStudyTimes(),
				users.getTodayAttendanceStatus()
			));
		}

		// 이번달 공부 시간 기준 내림차순 정렬
		allUsersList.sort(Comparator.comparing(UserResponse.AllUsers::thisMonthStudyTimes).reversed());

		return allUsersList;
	}

	@Transactional(readOnly = true)
	public UserResponse.MyAttendance getMyAttendanceInfo(String month, String email) {

		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UserException(INVALID_USER));

		List<Attendance> attendanceList = user.getAttendances();

		long thisMonthAttended = 0L;
		long thisMonthAbsent = 0L;
		long thisMonthVacation = 0L;

		List<AttendanceResponse.AttendanceDto> thisMonthAttendanceDtoList = new ArrayList<>();

		int targetMonth = Integer.parseInt(month);

		for (Attendance attendance : attendanceList) {
			if (attendance.getDate().getMonthValue() == targetMonth) {

				// 상태별 카운트
				switch (attendance.getAttendanceStatus()) {
					case ATTENDED -> thisMonthAttended++;
					case ABSENT -> thisMonthAbsent++;
					case VACATION -> thisMonthVacation++;
				}

				// DTO 변환 후 리스트에 추가
				thisMonthAttendanceDtoList.add(new AttendanceResponse.AttendanceDto(
					attendance.getDate(),
					attendance.getAttendanceStatus()
				));
			}
		}

		return new UserResponse.MyAttendance(
			thisMonthAttended,
			thisMonthAbsent,
			thisMonthVacation,
			thisMonthAttendanceDtoList
		);
	}

	@Transactional(readOnly = true)
	public UserResponse.MyHome getHomeInfo(String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UserException(INVALID_USER));

		return new UserResponse.MyHome(
			user.getName(),
			user.getThisWeekStudyTimes(),
			user.getThisWeekStudyTimes()
		);
	}

	@Transactional(readOnly = true)
	public List<UserResponse.AllStudyingUsers> getAllStudyingUsers() {
		List<UserResponse.AllStudyingUsers> allStudyingUsersList = new ArrayList<>();

		List<User> user = userRepository.findAll();
		for (User users : user) {
			if (users.getTodayStudyStatus() == StudyStatus.STUDYING) {
				allStudyingUsersList.add(new UserResponse.AllStudyingUsers(
					users.getName(),
					users.getEmail()
					)
				);
			}
		}

		return allStudyingUsersList;
	}

	@Transactional(readOnly = true)
	public UserResponse.AttendedUserCount getAttendedUserCount() {

		long count = 0L;

		List<User> user = userRepository.findAll();
		for (User users : user) {
			if (users.getTodayAttendanceStatus() == AttendanceStatus.ATTENDED) {
				count++;
			}
		}

		return new UserResponse.AttendedUserCount(count);
	}

	@Transactional
	public void changeIntroduce(UserRequest.Introduce introduce, String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UserException(INVALID_USER));

		user.changeIntroduce(introduce.introduce());
	}
}
