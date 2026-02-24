package com.school.utilslibrary.clients.billing.dtos;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

import com.school.utilslibrary.clients.billing.constants.EnrollmentStatus;
import com.school.utilslibrary.clients.education.constants.CourseStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataForBillingDTO {

	private Long enrollmentId;
	private EnrollmentStatus status;
	private LocalDate endDate;	
	private Set<DayOfWeek> learningDays;
	private String courseCode;
	private CourseStatus courseStatus;
	private String studentCode;

}
