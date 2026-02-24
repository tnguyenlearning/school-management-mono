package com.school.mgmt.education.session.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.school.mgmt.education.session.entities.Attendance;
import com.school.mgmt.education.session.services.AttendanceService;
import com.school.utilslibrary.restapi.ApiResponse;
import com.school.utilslibrary.restapi.ApiResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v2/attendances")
@RequiredArgsConstructor
public class AttendanceController {

	private final AttendanceService attendanceService;

	@PostMapping("/sessions/{sessionId}/mark")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<Long> markAttendance(@PathVariable Long sessionId, @RequestBody Attendance request) {
		attendanceService.markAttendance(sessionId, request);
		return ApiResponseBuilder.success("Attendance marked successfully.", null, null);

	}

	@PostMapping("/sessions/{sessionId}/mark-bulk")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<?> markBulkAttendance(@PathVariable Long sessionId, @RequestBody List<Attendance> requests) {
		attendanceService.markBulkAttendance(sessionId, requests);
		return ApiResponseBuilder.success("Attendance marked successfully for all students", null, null);
	}

}
