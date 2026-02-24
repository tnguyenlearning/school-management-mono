package com.school.mgmt.billing.entity;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.school.utilslibrary.constant.StudentAccountType;

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
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(
	name = "student_account",
	uniqueConstraints = @UniqueConstraint(columnNames = { "studentCode", "type" })
)
public class StudentAccount {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Student code must not be blank")
	@NotNull(message = "Student Code cannot be empty")
	@Column(nullable = false)
	private String studentCode;

	@JsonIgnore
	@OneToMany(mappedBy = "studentAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Receipt> receipts;

	@JsonIgnore
	@OneToMany(mappedBy = "studentAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Payment> payments;

	@Column(precision = 17, scale = 2, nullable = false)
	private BigDecimal balanceAmount;

	@NotNull(message = "Account type must not be null")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private StudentAccountType type;

}
