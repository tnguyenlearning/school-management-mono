package com.school.mgmt.billing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.school.mgmt.billing.entity.EnrollmentDiscount;

@Repository
public interface EnrollmentDiscountRepository extends JpaRepository<EnrollmentDiscount, Long> {

	List<EnrollmentDiscount> findAllByEnrollmentId(Long enrollmentId);

}
