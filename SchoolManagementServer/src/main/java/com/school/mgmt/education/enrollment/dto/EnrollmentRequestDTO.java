package com.school.mgmt.education.enrollment.dto;

import java.time.LocalDate;

import com.school.utilslibrary.clients.billing.constants.EnrollmentStatus;
import com.school.utilslibrary.exception.BadRequestException;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentRequestDTO {
	
	@NotNull(message = "StudentId cannot be empty")
	private Long studentId;
	
	@NotNull(message = "CourseId cannot be empty")
	private Long courseId;

	@NotNull(message = "Status cannot be empty")
	@Enumerated(EnumType.STRING)
	private EnrollmentStatus status;

	@NotNull(message = "Enrollment date cannot be empty")
	private LocalDate enrollmentDate;

	@NotNull(message = "Start date cannot be empty")
	private LocalDate startDate;

	private LocalDate endDate;

	@NotNull(message = "Start date cannot be empty")
	private Long billingFrequencyOptionId;

}
