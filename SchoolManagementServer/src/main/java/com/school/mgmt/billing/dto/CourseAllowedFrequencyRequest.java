package com.school.mgmt.billing.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseAllowedFrequencyRequest {

	private Long courseId;
	private String billingFrequencyOption;
	private LocalDate allowedDate;

}
