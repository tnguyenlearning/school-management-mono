package com.school.mgmt.education.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.mgmt.education.course.entity.CourseAssignment;

@RepositoryRestResource(path = "course-assignments")
public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, Long> {
}
