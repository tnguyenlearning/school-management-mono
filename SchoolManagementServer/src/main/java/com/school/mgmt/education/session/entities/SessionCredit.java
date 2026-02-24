package com.school.mgmt.education.session.entities;

import java.time.LocalDate;

import com.school.mgmt.education.enrollment.entities.Enrollment;
import com.school.utilslibrary.clients.education.constants.CreditSource;
import com.school.utilslibrary.clients.education.constants.SessionCreditStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "session_credit")
public class SessionCredit {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "enrollment_id", nullable = false)
	private Enrollment enrollmentId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "leave_request_id")
	private LeaveRequest leaveRequest;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "class_session_id")
	private ClassSession classSession;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 40)
	private CreditSource source;

	private int quantity;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private SessionCreditStatus status;

	private Long consumedBillingCycleId;

	private LocalDate consumedDate;
	private LocalDate expiresDate;

}
