package com.school.mgmt.billing.service;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.school.mgmt.billing.entity.BillingCycle;
import com.school.utilslibrary.constant.billing.BillingCycleStatus;

public class BillingCycleSpecification {

	public static Specification<BillingCycle> hasStatus(BillingCycleStatus status) {
		return (root, query, criteriaBuilder) -> status == null ? null
				: criteriaBuilder.equal(root.get("status"), status);
	}

	public static Specification<BillingCycle> hasStudentCode(String studentCode) {
		return (root, query, criteriaBuilder) -> studentCode == null ? null
				: criteriaBuilder.equal(root.get("studentCode"), studentCode);
	}

	public static Specification<BillingCycle> hasEnrollmentId(Long enrollmentId) {
		return (root, query, criteriaBuilder) -> enrollmentId == null ? null
				: criteriaBuilder.equal(root.get("enrollment").get("id"), enrollmentId);
	}

	public static Specification<BillingCycle> hasCycleNum(Integer cycleNum) {
		return (root, query, criteriaBuilder) -> cycleNum == null ? null
				: criteriaBuilder.equal(root.get("cycleNum"), cycleNum);
	}

	public static Specification<BillingCycle> hasCycleStartDateBetween(LocalDate startDate, LocalDate endDate) {
		return (root, query, criteriaBuilder) -> {
			if (startDate == null && endDate == null) {
				return null;
			}
			if (startDate != null && endDate != null) {
				return criteriaBuilder.between(root.get("cycleStartDate"), startDate, endDate);
			}
			if (startDate != null) {
				return criteriaBuilder.greaterThanOrEqualTo(root.get("cycleStartDate"), startDate);
			}
			return criteriaBuilder.lessThanOrEqualTo(root.get("cycleStartDate"), endDate);
		};
	}
	
}
