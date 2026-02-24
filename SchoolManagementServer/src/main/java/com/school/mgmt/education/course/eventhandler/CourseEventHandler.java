package com.school.mgmt.education.course.eventhandler;

import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

import com.school.mgmt.education.course.entity.Course;
import com.school.utilslibrary.constant.GlobalConstants;

import lombok.RequiredArgsConstructor;

@Component
@RepositoryEventHandler(Course.class)
@RequiredArgsConstructor
public class CourseEventHandler {

	@HandleBeforeCreate
	public void handleBeforeCreate(Course course) {
		if (course.getEndDate() == null) {
			course.setEndDate(GlobalConstants.MAX_DATE);
		}
		course.validate();
		
		// call api to create billingenrollment
	}
	
}
