package com.school.mgmt.billing.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "course_allowed_frequency")
public class CourseAllowedFrequency {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "CourseID cannot be empty")
	@Column(nullable = false)
	private Long courseId;

	@ManyToOne(optional = false)
	@JoinColumn(name = "billing_frequency_option_id", referencedColumnName = "id", nullable = false)
	private BillingFrequencyOption billingFrequencyOption;
	
	@Column(nullable = false)
	private LocalDate allowedDate;

	public Long getBillingFrequencyOptionId() {
		return billingFrequencyOption != null ? billingFrequencyOption.getId() : null;
	}
}
