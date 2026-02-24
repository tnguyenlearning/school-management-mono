package com.school.mgmt.education.session.entities;

import com.school.utilslibrary.constant.education.AttendanceStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attendance")
public class Attendance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "StudentID cannot be empty")
	@Column(nullable = false)
	private Long studentId;

	@ManyToOne
	@JoinColumn(name = "class_session_id", nullable = false)
	private ClassSession classSession;

	@Enumerated(EnumType.STRING)
	private AttendanceStatus status;

	private String remarks;

}
