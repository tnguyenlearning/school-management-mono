package com.school.mgmt.billing.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.school.utilslibrary.constant.billing.BillingCycleStatus;
import com.school.utilslibrary.constant.billing.BillingCycleType;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "billing_cycle")
public class BillingCycle {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "CourseCode cannot be empty")
	@Column(nullable = false)
	private String courseCode;

	@NotNull(message = "StudentCode cannot be empty")
	@Column(nullable = false)
	private String studentCode;

	@NotNull(message = "EnrollmentId cannot be empty")
	@Column(nullable = false)
	private Long enrollmentId;

	@ManyToOne
	@JoinColumn(name = "billing_frequency_option_id", nullable = false)
	private BillingFrequencyOption billingFrequencyOption;

	@JsonIgnore
	@OneToMany(mappedBy = "billingCycle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Payment> payments;

	@Column(nullable = false)
	private LocalDate generatedDate;

	@Column(nullable = false)
	private LocalDate cycleStartDate;

	@Column(nullable = false)
	private LocalDate cycleEndDate;
	
	@Column(nullable = false)
	private LocalDate dueDate;

	@Column(nullable = false)
	private Integer totalLearningDays;

	@Enumerated(EnumType.STRING)
	private BillingCycleStatus status;
	
	@Enumerated(EnumType.STRING)
	private BillingCycleType type;

	private Integer cycleNum;
	
	@Column(precision = 17, scale = 2, nullable = false)
	private BigDecimal amountDue;

	@Column(precision = 17, scale = 2, nullable = false)
	private BigDecimal amountPaid;

}
