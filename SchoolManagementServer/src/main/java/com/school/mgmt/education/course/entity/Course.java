package com.school.mgmt.education.course.entity;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

import com.school.mgmt.education.enrollment.entities.Enrollment;
import com.school.utilslibrary.clients.education.constants.CourseStatus;
import com.school.utilslibrary.constant.GlobalConstants;
import com.school.utilslibrary.exception.BadRequestException;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "course")
public class Course {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Enrollment> enrollments;

	@ElementCollection(targetClass = DayOfWeek.class)
	@CollectionTable(name = "timetable", joinColumns = @JoinColumn(name = "course_id"))
	@Column(name = "day")
	@Enumerated(EnumType.STRING)
	private Set<DayOfWeek> daysOfWeek;

//	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
//	private List<CourseFrequencyOption> frequencyOptions = new ArrayList<>();
//
//	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//	private List<ClassSession> classSessions = new ArrayList<>();
//
//	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//	private List<Assessment> assessments = new ArrayList<>();
//
//	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//	private List<CourseAssignment> courseAssignments = new ArrayList<>();

	@NotBlank(message = "Code cannot be empty")
	@Column(nullable = false)
	private String code;

	@NotBlank(message = "Name cannot be empty")
	@Column(nullable = false)
	private String name;

	private String description;

	@Column(nullable = false)
	@NotNull(message = "Status cannot be empty")
	@Enumerated(EnumType.STRING)
	private CourseStatus status;

	@Column(nullable = false)
	@NotNull(message = "Start date cannot be empty")
	private LocalDate startDate;

	@Column(nullable = false)
	private LocalDate endDate;

	@Column(nullable = false)
	@NotNull(message = "Start time cannot be empty")
	private LocalTime startTime;

	@Column(nullable = false)
	@NotNull(message = "End time cannot be empty")
	private LocalTime endTime;

	public void validate() {
		if (this.getEndDate() == null) {
			this.setEndDate(GlobalConstants.MAX_DATE);
		}
		if (daysOfWeek == null || daysOfWeek.isEmpty()) {
			throw new BadRequestException("Course days of week cannot be empty.");
		}
		if (startDate == null || endDate == null || startTime == null) {
			return;
		}
		if (endDate != null && endDate.isBefore(startDate)) {
			throw new BadRequestException("Start Date must be before End Date.");
		}
		if (endTime.isBefore(startTime)) {
			throw new BadRequestException("Start Time must be before End Time.");
		}
	}

}
