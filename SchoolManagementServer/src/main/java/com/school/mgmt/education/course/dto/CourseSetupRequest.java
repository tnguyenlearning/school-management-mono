package com.school.mgmt.education.course.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseSetupRequest {

	private CourseRequest course;
	private List<Long> frequencyOptionIds;

}
