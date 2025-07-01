package com.study.studymanagement.global.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.study.studymanagement.domain.user.entity.User;
import com.study.studymanagement.domain.user.repository.UserRepository;
import com.study.studymanagement.global.exception.exception.UserException;
import com.study.studymanagement.global.exception.handler.ExceptionCode;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
		User user = userRepository.findByLoginId(loginId)
			.orElseThrow(() -> new UserException(ExceptionCode.INVALID_USER));
		return new UserDetailsImpl(user);
	}
}
