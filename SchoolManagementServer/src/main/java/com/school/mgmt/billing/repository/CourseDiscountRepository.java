package com.school.mgmt.billing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.mgmt.billing.entity.CourseDiscount;

@RepositoryRestResource(path = "course-discount")
public interface CourseDiscountRepository extends JpaRepository<CourseDiscount, Long> {

	List<CourseDiscount> findAllByCourseCode(String courseCode);

}
