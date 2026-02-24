package com.school.mgmt.education.enrollment.dto;

import java.time.LocalDate;

import com.school.utilslibrary.clients.billing.constants.EnrollmentStatus;
import com.school.utilslibrary.constant.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentEnrollmentDTO {

	private Long studentId;
	private String studentCode;
	private String firstName;
	private String lastName;
	private Gender gender;
	private int age;
	private String phoneNumber;
	private String email;
	private String address;

	private Long enrollmentId;
	private LocalDate enrollmentDate;
	private LocalDate startDate;
	private LocalDate endDate;
	private EnrollmentStatus enrollmentStatus;

}
