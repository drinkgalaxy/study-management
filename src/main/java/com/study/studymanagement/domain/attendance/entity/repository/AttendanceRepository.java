package com.study.studymanagement.domain.attendance.entity.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.study.studymanagement.domain.attendance.entity.Attendance;
import com.study.studymanagement.domain.attendance.entity.AttendanceStatus;
import com.study.studymanagement.domain.user.entity.User;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	boolean existsByUserAndDate(User user, LocalDate date);

	List<Attendance> findAllByDateAndAttendanceStatus(LocalDate date, AttendanceStatus status);


}
