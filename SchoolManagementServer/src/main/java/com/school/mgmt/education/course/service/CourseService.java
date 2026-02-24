package com.school.mgmt.education.course.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.school.mgmt.billing.entity.BillingFrequencyOption;
import com.school.mgmt.billing.entity.CourseAllowedFrequency;
import com.school.mgmt.billing.repository.BillingFrequencyOptionRepository;
import com.school.mgmt.billing.service.CourseAllowedFrequencyService;
import com.school.mgmt.education.course.dto.CourseRequest;
import com.school.mgmt.education.course.entity.Course;
import com.school.mgmt.education.course.repository.CourseRepository;
import com.school.mgmt.education.enrollment.entities.Student;
import com.school.mgmt.education.enrollment.repositories.EnrollmentRepository;
import com.school.mgmt.education.validator.StatusValidator;
import com.school.mgmt.util.autonum.service.AutoNumberService;
import com.school.utilslibrary.clients.billing.dtos.AllowedFrequencyRequest;
import com.school.utilslibrary.clients.education.constants.CourseStatus;
import com.school.utilslibrary.constant.AnumType;
import com.school.utilslibrary.exception.NotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {

	private final CourseRepository courseRepository;
	private final CourseAllowedFrequencyService allowedFrequencyService;
	private final AutoNumberService autoNumberService;

	private final BillingFrequencyOptionRepository billingFrequencyOptionRepository;
	private final EnrollmentRepository enrollmentRepository;
	private final ModelMapper modelMapper;


	public void validateCourseStatus(Long courseId, CourseStatus newStatus) {
		Course course = findById(courseId);
		StatusValidator.validateCourseStatusTransition(course.getStatus(), newStatus);
	}

//	public void persistEnrollmentStatus(String courseId, CourseStatus newStatus) {
//		List<Enrollment> enrollments = enrollmentService.findAllByCourseId(courseId);
//		StatusValidator.updateEnrollmentStatusesBasedOnCourseStatus(newStatus, enrollments);
//
//	}

	@Transactional
	public Course create(CourseRequest courseRequest, List<Long> frequencyIds) {
		Course course = modelMapper.map(courseRequest, Course.class);
		course.validate();

		Course createdCourse = courseRepository.save(course);

		for (Long freqId : frequencyIds) {
			BillingFrequencyOption freqOption = billingFrequencyOptionRepository.findById(freqId)
					.orElseThrow(() -> new NotFoundException("Option with ID " + freqId + " not found."));
			CourseAllowedFrequency allowedFrequency = new CourseAllowedFrequency();
			allowedFrequency.setAllowedDate(LocalDate.now());
			allowedFrequency.setBillingFrequencyOption(freqOption);
			allowedFrequency.setCourseId(createdCourse.getId());
			allowedFrequencyService.save(allowedFrequency);
		}
		
		autoNumberService.deleteReservedNumber(AnumType.ENGLISH_COURSE, createdCourse.getCode());

		return createdCourse;
	}

	@Transactional
	public Course update(Long courseId, CourseRequest request, List<Long> frequencyIds) {
		boolean isUpdateBilling = false;
		Course existingCourse = findById(courseId);
		if (existingCourse.getStatus() != request.getStatus()) {
//			validateCourseStatus(courseId, request.getStatus());
//			persistEnrollmentStatus(courseId, request.getStatus());
		}
		if (existingCourse.getStartDate() != request.getStartDate()) {
			isUpdateBilling = true;
		}

		Course course = modelMapper.map(request, Course.class);
		course.setId(courseId);
		course.validate();

		List<AllowedFrequencyRequest> allowedFrequencyRequest = new ArrayList<>();
		
		for (Long freqId : frequencyIds) {
			AllowedFrequencyRequest freqRequest = new AllowedFrequencyRequest();
			freqRequest.setAllowedDate(LocalDate.now());
			freqRequest.setBillingFrequencyOptionId(freqId);
			allowedFrequencyRequest.add(freqRequest);
		}
		
		if (isUpdateBilling) {
			enrollmentRepository.updateNextBillingDateIfEarlier(courseId, request.getStartDate());
		}
		
		allowedFrequencyService.update(courseId, allowedFrequencyRequest);

		return courseRepository.save(course);

	}

	public Page<Course> getAllcourses(int page, int size) {
		Page<Course> courses = courseRepository.findAll(PageRequest.of(page - 1, size));

		if (courses.isEmpty()) {
			throw new NotFoundException("No courses found for the specified page and size.");
		}

		return courses;
	}

	public List<Student> searchStudentsByStudentCodeNotEnrolled(String courseId, String studentCode) {
		return courseRepository.findStudentsByStudentCodeNotEnrolled(courseId, studentCode);
	}

	public List<Student> searchStudentsByPhoneNotEnrolled(String courseId, String phone) {
		return courseRepository.findStudentsByPhoneNotEnrolled(courseId, phone);
	}

	public List<Student> searchStudentsByNameNotEnrolled(String courseId, String firstName) {
		return courseRepository.findStudentsByFirstNameNotEnrolled(courseId, firstName);
	}

	public Course mapToEntity(CourseRequest courseRequest) {
		Course course = new Course();
		course.setCode(courseRequest.getCode());
		course.setName(courseRequest.getName());
		course.setDescription(courseRequest.getDescription());
		course.setStatus(courseRequest.getStatus());
		course.setStartDate(courseRequest.getStartDate());
		course.setEndDate(courseRequest.getEndDate());
		course.setStartTime(courseRequest.getStartTime());
		course.setEndTime(courseRequest.getEndTime());
		course.setDaysOfWeek(courseRequest.getDaysOfWeek());
		return course;
	}

	public Course findById(Long courseId) {
		return courseRepository.findById(courseId)
				.orElseThrow(() -> new NotFoundException("Course with ID " + courseId + " not found."));
	}

}
