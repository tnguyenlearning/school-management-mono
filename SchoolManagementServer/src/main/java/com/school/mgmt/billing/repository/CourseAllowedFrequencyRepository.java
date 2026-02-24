package com.school.mgmt.billing.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.data.rest.core.config.Projection;

import com.school.mgmt.billing.entity.CourseAllowedFrequency;

@RepositoryRestResource(path = "course-allowed-frequency", excerptProjection = CourseAllowedFrequencyProjection.class)
public interface CourseAllowedFrequencyRepository extends JpaRepository<CourseAllowedFrequency, Long> {
	
	@RestResource(path = "findByCourseId")
    List<CourseAllowedFrequency> findByCourseId(Long courseId);
}

@Projection(name = "courseAllowedFrequencyProjection", types = { CourseAllowedFrequency.class })
interface CourseAllowedFrequencyProjection {
    Long getId();
    Long getCourseId();
    Long getBillingFrequencyOptionId();
    LocalDate getAllowedDate();
}
