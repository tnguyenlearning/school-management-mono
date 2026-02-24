package com.school.mgmt.education.session.entities;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.school.mgmt.education.course.entity.Course;
import com.school.utilslibrary.constant.education.SessionStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "classsession")
public class ClassSession {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToMany(mappedBy = "classSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Attendance> attendances;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id", nullable = false)
	private Course course;

	@OneToMany(mappedBy = "classSession", fetch = FetchType.LAZY)
	private List<LeaveRequest> leaveRequests;

	private LocalDate sessionDate;

	private LocalTime adjustedStartTime;
	private LocalTime adjustedEndTime;

	@Enumerated(EnumType.STRING)
	private SessionStatus status;

	private String remark;

}
