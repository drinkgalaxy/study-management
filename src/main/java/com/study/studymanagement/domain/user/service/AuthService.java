package com.study.studymanagement.domain.user.service;

import static com.study.studymanagement.global.exception.handler.ExceptionCode.*;

import java.time.Duration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;
import com.study.studymanagement.domain.user.dto.UserRequest;
import com.study.studymanagement.domain.user.entity.StudyStatus;
import com.study.studymanagement.domain.user.entity.User;
import com.study.studymanagement.domain.user.repository.UserRepository;
import com.study.studymanagement.global.exception.exception.UserException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

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
}
