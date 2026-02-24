package com.school.mgmt.education.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.mgmt.education.course.entity.Assessment;

@RepositoryRestResource(path = "assessments")
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
}
	