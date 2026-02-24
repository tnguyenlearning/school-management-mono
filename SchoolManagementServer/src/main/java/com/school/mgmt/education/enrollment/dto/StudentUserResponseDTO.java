package com.school.mgmt.education.enrollment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentUserResponseDTO {

	private String userId;
	
	private String studentCode;

}
