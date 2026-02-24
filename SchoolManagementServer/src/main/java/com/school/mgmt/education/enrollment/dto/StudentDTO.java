package com.school.mgmt.education.enrollment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentDTO {

	private Long id;

	private String studentCode;

	private String firstName;

	private String lastName;

	private String gender;

	private int age;

	private String email;

	private String phoneNumber;

	private String address;

}
