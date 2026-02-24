package com.school.mgmt.education.enrollment.entities;

import java.time.LocalDate;

import com.school.mgmt.billing.entity.BillingFrequencyOption;
import com.school.mgmt.education.course.entity.Course;
import com.school.utilslibrary.clients.billing.constants.EnrollmentStatus;
import com.school.utilslibrary.exception.BadRequestException;

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
@Table(name = "enrollment", uniqueConstraints = @UniqueConstraint(columnNames = { "student_id", "course_id",
		"status" }))
public class Enrollment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private Student student;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id", nullable = false)
	private Course course;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "billing_frequency_option_id", nullable = false)
	private BillingFrequencyOption billingFrequencyOption;

	@NotNull(message = "Status cannot be empty")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EnrollmentStatus status;

	@NotNull(message = "Enrollment date cannot be empty")
	@Column(nullable = false)
	private LocalDate enrollmentDate;

	@NotNull(message = "Start date cannot be empty")
	@Column(nullable = false)
	private LocalDate startDate;

	@Column(nullable = false)
	private LocalDate endDate;

	@Column(nullable = false)
	private LocalDate nextBillingDate;

	public void validate() {
		if (!EnrollmentStatus.ENROLLMENT_STATUS.contains(this.status)) {
			throw new BadRequestException("Invalid enrollment status " + this.status);
		}
		if (endDate.isBefore(startDate)) {
			throw new BadRequestException("Start Date must be before or equal end date");
		}
		if (startDate.isBefore(enrollmentDate)) {
			throw new BadRequestException("Enrollment date Date must be before or equal start date");
		}
	}
}
