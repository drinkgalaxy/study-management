package com.study.studymanagement.domain.user.dto;

public class UserRequest {

	public record Signup(String name, String loginId, String password, String email) {
	}

	public record Login(String loginId, String password) {
	}
}
