package com.school.mgmt.billing.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.school.utilslibrary.constant.billing.DiscountType;

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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "discount")
public class Discount {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToMany(mappedBy = "discount", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<CourseDiscount> courseDiscounts;

	@OneToMany(mappedBy = "discount", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<EnrollmentDiscount> enrollmentDiscounts;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private DiscountType type;

	@Column(nullable = false, precision = 17, scale = 2)
	private BigDecimal value;

	@Column(nullable = false)
	private int remainingUses;

	@Column(nullable = false)
	private LocalDate validFrom;

	@Column(nullable = false)
	private LocalDate validTo;

	private String description;

	@Column(nullable = false)
	private Boolean isActive;

}
