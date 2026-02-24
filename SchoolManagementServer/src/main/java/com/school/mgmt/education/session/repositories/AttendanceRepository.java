package com.school.mgmt.education.session.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.mgmt.education.session.entities.Attendance;
import com.school.mgmt.education.session.entities.ClassSession;

@RepositoryRestResource(path = "attendances")
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	Optional<Attendance> findByClassSessionAndStudentId(ClassSession session, Long studentId);

}
