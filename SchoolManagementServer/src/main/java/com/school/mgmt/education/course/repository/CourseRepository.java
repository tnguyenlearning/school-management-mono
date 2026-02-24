package com.school.mgmt.education.course.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.mgmt.education.course.entity.Course;
import com.school.mgmt.education.enrollment.entities.Student;

@RepositoryRestResource(path = "courses")

public interface CourseRepository extends JpaRepository<Course, Long> {

	@Query("SELECT s FROM Student s WHERE s.studentCode LIKE %:studentCode% "
			+ "AND s.id NOT IN (SELECT e.student.id FROM Enrollment e WHERE e.course.id = :courseId)")
	List<Student> findStudentsByStudentCodeNotEnrolled(String courseId, String studentCode);

	@Query("SELECT s FROM Student s WHERE s.phoneNumber LIKE %:phoneNumber% "
			+ "AND s.id NOT IN (SELECT e.student.id FROM Enrollment e WHERE e.course.id = :courseId)")
	List<Student> findStudentsByPhoneNotEnrolled(String courseId, String phoneNumber);

	@Query("SELECT s FROM Student s WHERE s.firstName LIKE %:firstName% "
			+ "AND s.id NOT IN (SELECT e.student.id FROM Enrollment e WHERE e.course.id = :courseId)")
	List<Student> findStudentsByFirstNameNotEnrolled(String courseId, String firstName);

}

