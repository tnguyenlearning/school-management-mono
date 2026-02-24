package com.school.mgmt.education.session.entities;

import java.time.LocalDate;

import com.school.mgmt.education.course.entity.Course;
import com.school.mgmt.education.enrollment.entities.Student;
import com.school.utilslibrary.constant.education.LeaveStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "leave_request", uniqueConstraints = {
		@UniqueConstraint(name = "uk_leave_student_session", columnNames = { "student_id", "session_id" }) })
public class LeaveRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "Student cannot be empty")
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private Student student;

	@NotNull(message = "Course cannot be empty")
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id", nullable = false)
	private Course course;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "session_id", nullable = false)
	private ClassSession classSession;

	@Column(nullable = false)
	private LocalDate leaveDate;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private LeaveStatus status; // REQUESTED, APPROVED, REJECTED

	@Column(nullable = false)
	private LocalDate requestedDate;

	private LocalDate decisionDate;

	private String reason;

	private String remarks;

}
