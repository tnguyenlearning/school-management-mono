package com.school.mgmt.education.session.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.school.mgmt.education.session.entities.ClassSession;
import com.school.mgmt.education.session.services.ClassSessionService;
import com.school.utilslibrary.restapi.ApiResponse;
import com.school.utilslibrary.restapi.ApiResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v2/class-sessions")
@RequiredArgsConstructor
public class ClassSessionController {

	private final ClassSessionService classSessionService;

	@PostMapping("courses/{courseId}/generate")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<?> generateSessions(@PathVariable Long courseId, @RequestParam int monthsAhead) {
		classSessionService.createSessionsForCourse(courseId, monthsAhead);
		return ApiResponseBuilder.success("Generate sessions successfully", null, null);
	}

	@PostMapping("courses/{courseId}/add-session")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<?> addManualSession(@PathVariable Long courseId, @RequestBody ClassSession request) {
		classSessionService.addManualSession(courseId, request);
		return ApiResponseBuilder.success("Session added successfully", null, null);
	}

}
