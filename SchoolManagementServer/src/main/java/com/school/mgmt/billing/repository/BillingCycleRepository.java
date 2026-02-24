package com.school.mgmt.billing.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.school.mgmt.billing.entity.BillingCycle;
import com.school.utilslibrary.constant.billing.BillingCycleStatus;

@Repository
public interface BillingCycleRepository
		extends JpaRepository<BillingCycle, Long>, JpaSpecificationExecutor<BillingCycle> {

	@Query("SELECT b FROM BillingCycle b "
			+ "WHERE b.status = :status AND "
			+ "b.studentCode BETWEEN :fromStudentCode AND :toStudentCode AND "
			+ "b.generatedDate <= :effDate")
	List<BillingCycle> findAllByStatusAndStudentCodeRangeAndGeneratedDate(
	    @Param("status") BillingCycleStatus status,
	    @Param("fromStudentCode") String fromStudentCode,
	    @Param("toStudentCode") String toStudentCode,
	    @Param("effDate") LocalDate effDate);

	Optional<BillingCycle> findTopByEnrollmentIdOrderByCycleNumDesc(Long enrollmentId);

}
