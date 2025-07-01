package com.study.studymanagement.domain.user.service;

import java.time.Duration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;
import com.study.studymanagement.domain.user.dto.UserRequest;
import com.study.studymanagement.domain.user.entity.StudyStatus;
import com.study.studymanagement.domain.user.entity.User;
import com.study.studymanagement.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final AuthenticationManager authenticationManager;
	private final BCryptPasswordEncoder encoder;

	@Transactional
	public void signupUser(UserRequest.Signup request) {
		User user = User.builder()
			.name(request.name())
			.loginId(request.loginId())
			.password(encoder.encode(request.password()))
			.email(request.email())
			.consecutiveStudyDays(0L)
			.introduce("")
			.thisMonthStudyTimes(Duration.ZERO)
			.thisWeekStudyTimes(Duration.ZERO)
			.thisMonthLeave(3L)
			.todayAttendanceStatus(AttendanceStatus.NO_ATTENDED)
			.studyStatus(StudyStatus.PAUSED)
			.build();
		userRepository.save(user);
	}
}
