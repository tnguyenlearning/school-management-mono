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
public class GenerateInvoiceRequestDTO {
	
	private String fromStudentId;
	private String toStudentId;
	private LocalDate effDate;
	
}
