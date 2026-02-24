package com.school.mgmt.education.session.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.school.mgmt.education.session.entities.Attendance;
import com.school.mgmt.education.session.entities.ClassSession;
import com.school.mgmt.education.session.repositories.AttendanceRepository;
import com.school.mgmt.education.session.repositories.ClassSessionRepository;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {

	private final ClassSessionRepository classSessionRepository;
	private final AttendanceRepository attendanceRepository;
	private final EntityManager entityManager;

	public void markAttendance(Long sessionId, Attendance request) {
		ClassSession session = classSessionRepository.findById(sessionId)
				.orElseThrow(() -> new RuntimeException("Session not found"));

		Attendance attendance = attendanceRepository.findByClassSessionAndStudentId(session, request.getStudentId())
				.orElse(new Attendance());

		attendance.setClassSession(session);
		attendance.setStudentId(request.getStudentId());
		attendance.setStatus(request.getStatus());
		attendance.setRemarks(request.getRemarks());

		attendanceRepository.save(attendance);
	}

	@Transactional
	public void markBulkAttendance(Long sessionId, List<Attendance> requests) {
		ClassSession session = classSessionRepository.findById(sessionId)
				.orElseThrow(() -> new RuntimeException("Session not found"));

		List<Attendance> attendances = new ArrayList<>();
		for (Attendance request : requests) {
			Attendance attendance = attendanceRepository.findByClassSessionAndStudentId(session, request.getStudentId())
					.orElse(new Attendance());

			attendance.setClassSession(session);
			attendance.setStudentId(request.getStudentId());
			attendance.setStatus(request.getStatus());
			attendance.setRemarks(request.getRemarks());

			attendances.add(attendance);
		}

		for (Attendance attendance : attendances) {
			entityManager.merge(attendance);
		}
	}

}
