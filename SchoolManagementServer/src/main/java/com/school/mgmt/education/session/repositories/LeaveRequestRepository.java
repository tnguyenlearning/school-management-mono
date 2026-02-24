package com.school.mgmt.education.session.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import com.school.mgmt.education.session.entities.LeaveRequest;
import com.school.utilslibrary.constant.education.LeaveStatus;

@RepositoryRestResource(path = "leave-requests")
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
	
	@Query("SELECT l FROM LeaveRequest l "
			+ "WHERE l.student.studentCode BETWEEN :fromStudentCode AND :toStudentCode " 
			+ "AND :effDate >= l.decisionDate AND :status = status")
	List<LeaveRequest> getLeaveForBilling(String fromStudentCode, String toStudentCode, LocalDate effDate, LeaveStatus status);

	@Query("""
			  SELECT lr FROM LeaveRequest lr
			  WHERE (:leaveDateFrom IS NULL OR lr.leaveDate >= :leaveDateFrom)
			    AND (:leaveDateTo   IS NULL OR lr.leaveDate   <= :leaveDateTo)
			    AND (:status        IS NULL OR lr.status      =  :status)
			    AND (:requestedFrom IS NULL OR lr.requestedDate >= :requestedFrom)
			    AND (:requestedTo   IS NULL OR lr.requestedDate <= :requestedTo)
			    AND (:decisionFrom  IS NULL OR lr.decisionDate  >= :decisionFrom)
			    AND (:decisionTo    IS NULL OR lr.decisionDate  <= :decisionTo)
			""")
	Page<LeaveRequest> findLeaveRequestsByFilters(
			@Param("leaveDateFrom") LocalDate leaveDateFrom,
			@Param("leaveDateTo") LocalDate leaveDateTo,

			@Param("status") LeaveStatus status, // enum or string—match your entity

			@Param("requestedFrom") LocalDate requestedFrom,
			@Param("requestedTo") LocalDate requestedTo,

			@Param("decisionFrom") LocalDate decisionFrom,
			@Param("decisionTo") LocalDate decisionTo,

			Pageable pageable);
	
	@RestResource(path = "by-session-student", rel = "by-session-student")
	Optional<LeaveRequest> findByClassSession_IdAndStudent_Id(
			@Param("sessionId") Long sessionId,
			@Param("studentId") Long studentId);

}
