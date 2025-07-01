package com.study.studymanagement.domain.user.service;

import static com.study.studymanagement.global.exception.handler.ExceptionCode.*;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
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

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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

	@Transactional
	public void loginUser(UserRequest.Login request, HttpServletRequest httpRequest) {
		try {
			UsernamePasswordAuthenticationToken authToken =
				new UsernamePasswordAuthenticationToken(request.loginId(), request.password());

			Authentication authentication = authenticationManager.authenticate(authToken);
			SecurityContextHolder.getContext().setAuthentication(authentication);

			// 세션 설정
			HttpSession session = httpRequest.getSession(true);
			session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
				SecurityContextHolder.getContext());

		} catch (AuthenticationException e) {
			throw new UserException(LOGIN_FAILED);
		}

	}

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

		// 정렬 우선순위 정의
		Map<AttendanceStatus, Integer> statusPriority = Map.of(
			AttendanceStatus.ATTENDED, 1,
			AttendanceStatus.NO_ATTENDED, 2,
			AttendanceStatus.VACATION, 3
		);

		// 우선순위에 따라 정렬
		allUsersList.sort(Comparator.comparing(
			userDto -> statusPriority.getOrDefault(userDto.todayAttendanceStatus(), Integer.MAX_VALUE)
		));

		return allUsersList;
	}

	@Transactional
	public List<UserResponse.MyAttendance> getMyAttendanceInfo(String month, String email) {

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

		return List.of(new UserResponse.MyAttendance(
			thisMonthAttended,
			thisMonthAbsent,
			thisMonthVacation,
			thisMonthAttendanceDtoList
		));
	}
}
