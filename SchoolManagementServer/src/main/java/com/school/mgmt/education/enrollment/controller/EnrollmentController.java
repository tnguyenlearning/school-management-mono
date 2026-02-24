package com.school.mgmt.education.enrollment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.school.mgmt.education.enrollment.dto.EnrollmentRequestDTO;
import com.school.mgmt.education.enrollment.service.EnrollmentService;
import com.school.utilslibrary.clients.billing.dtos.DataForBillingRequest;
import com.school.utilslibrary.restapi.ApiResponse;
import com.school.utilslibrary.restapi.ApiResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v2/enrollments")
@RequiredArgsConstructor
@Validated
public class EnrollmentController {

	private final EnrollmentService enrollmentService;

	@GetMapping
	public List<String> getAllEnrollments() {
		return List.of("Enrollment 1", "Enrollment 2", "Enrollment 3");
	}

	@GetMapping("/courses/{courseId}/studentsDetail")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<?> getStudentAndEnrollmentsByEnrollmentId(@PathVariable Long courseId) {
		return ApiResponseBuilder.success(null, enrollmentService.findStudentsAndEnrollmentByCourseId(courseId), null);
	}
	
	@PostMapping("/getDataForBilling")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<?> getDataForBilling(@RequestBody DataForBillingRequest request) {
		return ApiResponseBuilder.success("success", enrollmentService.getDataForBilling(request), null);
	}
	
	@PostMapping
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<?> addStudentToCourse(@RequestBody EnrollmentRequestDTO request) {
		enrollmentService.enroll(request);
		return ApiResponseBuilder.success("Enroll successfully",  null, null);
	}

	@PutMapping("{enrollmentId}")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<?> updateEnrollment(@PathVariable Long enrollmentId, @RequestBody EnrollmentRequestDTO request) {
		enrollmentService.update(enrollmentId, request);
		return ApiResponseBuilder.success("Update Enroll successfully",  null, null);

	}

//	@GetMapping("/courses/{courseId}/studentsWithEnrollments")
//	public ResponseEntity<List<StudentEnrollmentDTO>> getStudentsAndEnrollmentByCourseId(
//			@PathVariable Long courseId) {
//
//		List<StudentEnrollmentDTO> students = enrollmentService.getStudentsAndEnrollmentByCourseId(courseId);
//		return ResponseEntity.ok(students);
//	}

//
//	@GetMapping("/{enrollmentId}/studentsWithEnrollments")
//	public ResponseEntity<StudentEnrollmentDTO> getStudentsAndEnrollmentByenrollmentId(
//			@PathVariable String enrollmentId) {
//
//		StudentEnrollmentDTO students = enrollmentService.getStudentAndEnrollmentByEnrollmentId(enrollmentId);
//		return ResponseEntity.ok(students);
//	}
//
//	@GetMapping("/courses/{courseId}/students")
//	@ResponseStatus(HttpStatus.OK)
//	public List<Student> getStudentsByCourseId(@PathVariable String courseId) {
//		List<Student> students = enrollmentService.getStudentsByCourseId(courseId);
//
//		return students;
//	}
//
//	@GetMapping("/students/{studentId}/courses")
//	@ResponseStatus(HttpStatus.OK)
//	public List<Course> getCoursesByStudentId(@PathVariable String studentId) {
//		List<Course> courses = enrollmentService.getCoursesByStudentId(studentId);
//
//		return courses;
//	}
//
//	@DeleteMapping("/courses/{courseId}/students/{studentId}")
//	public ResponseEntity<Map<String, Long>> removeStudentFromCourse(@PathVariable String courseId,
//			@PathVariable String studentId) {
//		enrollmentService.removeStudentFromCourse(courseId, studentId);
//
//		Map<String, Long> response = new HashMap<>();
//		response.put("message", "Student removed from course successfully.");
//		return ResponseEntity.ok(response);
//	}
//
//	@PostMapping("/courses/{courseId}/students/{studentId}/enroll")
//	public ResponseEntity<Map<String, Long>> enrollStudent(@PathVariable String courseId,
//
//			@PathVariable String studentId, @Valid @RequestBody EnrollmentRequestDTO enrollmentDTO) {
//		String message = enrollmentService.enrollStudentInCourse(courseId, studentId, enrollmentDTO);
//
//		// Prepare a response with a key for the message
//		Map<String, Long> response = new HashMap<>();
//		response.put("message", message);
//
//		if (message.contains("not found") || message.contains("already enrolled")) {
//			return ResponseEntity.badRequest().body(response);
//		}
//		return ResponseEntity.ok(response);
//	}

}
