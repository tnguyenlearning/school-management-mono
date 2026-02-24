package com.school.mgmt.education.course.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.school.mgmt.education.course.dto.CourseSetupRequest;
import com.school.mgmt.education.course.entity.Course;
import com.school.mgmt.education.course.service.CourseService;
import com.school.utilslibrary.restapi.ApiResponse;
import com.school.utilslibrary.restapi.ApiResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v2/courses")
@RequiredArgsConstructor
public class CourseController {


	private final CourseService courseService;


//	@PostMapping("/generate-range")
//	@ResponseStatus(HttpStatus.OK)
//	public ApiResponse<List<GenerateBillingResponseDTO>> generateRangeBillings(
//			@RequestBody GenerateBillingRequestDTO request) {
//		List<GenerateBillingResponseDTO> generatedBillings = billingCycleService
//				.generateBillingForRangeStudents(request);
//
//		return ApiResponseBuilder.success("courses retrieved successfully", generatedBillings, null);
//
//	}
	@PostMapping
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<Course> createCourse(@RequestBody CourseSetupRequest courseSetupRequest) {
		Course createdCourse = courseService.create(courseSetupRequest.getCourse(),
				courseSetupRequest.getFrequencyOptionIds());
		return ApiResponseBuilder.success("Course created successfully", createdCourse, null);
	}

	@PutMapping("{courseId}")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<String> updateCourse(@PathVariable Long courseId,
			@RequestBody CourseSetupRequest courseSetupRequest) {
		courseService.update(courseId, courseSetupRequest.getCourse(),
				courseSetupRequest.getFrequencyOptionIds());
		return ApiResponseBuilder.success("Course updated successfully", "updated", null);
	}

//	@GetMapping("/{courseId}/students/searchByStudentCodeNotEnrolled")
//	public ResponseEntity<List<Student>> searchStudentsByStudentCodeNotEnrolled(@PathVariable Long courseId,
//			@RequestParam String studentCode) {
//
//		List<Student> students = courseService.searchStudentsByStudentCodeNotEnrolled(courseId, studentCode);
//		return ResponseEntity.ok(students);
//	}
//
//	@GetMapping("/{courseId}/students/searchByPhoneNotEnrolled")
//	public ResponseEntity<List<Student>> searchStudentsByPhoneNotEnrolled(@PathVariable Long courseId,
//			@RequestParam String phone) {
//
//		List<Student> students = courseService.searchStudentsByPhoneNotEnrolled(courseId, phone);
//		return ResponseEntity.ok(students);
//	}
//
//	@GetMapping("/{courseId}/students/searchByFirstNameNotEnrolled")
//	public ResponseEntity<List<Student>> searchStudentsByNameNotEnrolled(@PathVariable Long courseId,
//			@RequestParam String firstName) {
//
//		List<Student> students = courseService.searchStudentsByNameNotEnrolled(courseId, firstName);
//		return ResponseEntity.ok(students);
//	}

}
