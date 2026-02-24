package com.school.mgmt.billing.entity;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.rest.core.annotation.RestResource;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.school.mgmt.education.enrollment.entities.Enrollment;
import com.school.utilslibrary.constant.billing.Frequency;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "billing_frequency_option")
public class BillingFrequencyOption {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@JsonIgnore
	@RestResource(exported = false)
	@OneToMany(mappedBy = "billingFrequencyOption", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CourseAllowedFrequency> courseAllowedFrequencies;
	
	@JsonIgnore
	@OneToMany(mappedBy = "billingFrequencyOption", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<BillingCycle> billingCycles;
	
	@JsonIgnore
	@OneToMany(mappedBy = "billingFrequencyOption", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Enrollment> enrollments;

	@Column(nullable = false)
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Frequency frequency;

	@Column(name = "total_learning_days")
	private Integer totalLearningDays;

	@Column(name = "fee_amount", precision = 17, scale = 2, nullable = false)
	private BigDecimal feeAmount;

	@Column(name = "is_active", nullable = false)
	private Boolean isActive;

}
