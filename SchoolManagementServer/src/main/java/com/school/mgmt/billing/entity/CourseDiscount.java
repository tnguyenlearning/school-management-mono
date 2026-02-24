package com.school.mgmt.billing.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "course_discount")
public class CourseDiscount {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "CourseCode cannot be empty")
	@Column(nullable = false)
	private String courseCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "discount_id", nullable = false)
	private Discount discount;

	@Column(nullable = false)
	private Integer remainingUses;

	@Column(nullable = false)
	private LocalDate validFrom;

	@Column(nullable = false)
	private LocalDate validTo;

	@Column(nullable = false)
	private Boolean isActive;

}
