package com.school.utilslibrary.clients.education.dtos;

import java.time.LocalDate;

import com.school.utilslibrary.clients.billing.constants.EnrollmentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentDTO {

	private Long id;

	private EnrollmentStatus status;

	private LocalDate enrollmentDate;

	private LocalDate startDate;

	private LocalDate endDate;

}
