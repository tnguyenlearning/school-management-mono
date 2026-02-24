package com.school.mgmt.education.enrollment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.school.mgmt.education.enrollment.entities.Student;
import com.school.mgmt.education.enrollment.repository.StudentRepository;
import com.school.mgmt.education.enrollment.service.StudentService;
import com.school.utilslibrary.restapi.ApiResponse;
import com.school.utilslibrary.restapi.ApiResponseBuilder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/v2/students")
@RestController
@RequiredArgsConstructor
public class StudentController {

	private final StudentRepository studentRepository;
	private final StudentService studentService;

	@GetMapping("/search/findStudentCodeContaining")
	public ApiResponse<List<String>> findStudentCodeContaining(@RequestParam(required = false) String phone,
			@RequestParam(required = false) String studentCode, @RequestParam(required = false) String firstName) {
		return ApiResponseBuilder.success("Success",
				studentRepository.findStudentCodeContaining(phone, studentCode, firstName), null);
	}

	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping
	public ApiResponse<String> create(@Valid @RequestBody Student student) {
		Student createdStudent = studentService.create(student);
		return ApiResponseBuilder.success("Student created successfully", "Created student with code is: " + createdStudent.getStudentCode(), null);
	}

}
