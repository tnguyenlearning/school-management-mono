package com.school.mgmt.billing.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GenerateBillingRequestDTO {
	
	private String fromStudentCode;
	private String toStudentCode;
	private LocalDate effDate;
	
}
