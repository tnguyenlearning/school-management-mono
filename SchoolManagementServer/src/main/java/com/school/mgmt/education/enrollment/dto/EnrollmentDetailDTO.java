package com.school.mgmt.education.enrollment.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.school.utilslibrary.clients.billing.constants.EnrollmentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDetailDTO {

	private String studentId;
	private String studentCode;
	private String firstName;
	private String lastName;
	private String gender;
	private int age;
	private String phoneNumber;
	private String email;
	private String address;

	private String enrollmentId;
	private LocalDate enrollmentDate;
	private LocalDate startDate;
	private LocalDate endDate;
	private EnrollmentStatus enrollmentStatus;

	private String frequency;
	private Integer totalLearningDays;
	private BigDecimal feeAmount;

}
