package com.school.utilslibrary.clients.education;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchStudentRequest {
	private String phone;
	private String studentCode;
	private String firstName;
}
