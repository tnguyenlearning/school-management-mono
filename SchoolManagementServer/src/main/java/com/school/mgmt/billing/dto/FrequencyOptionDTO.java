package com.school.mgmt.billing.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FrequencyOptionDTO {

	private String name;

	private String frequency;

	private Integer totalLearningDays;

	private BigDecimal feeAmount;

	private Boolean isActive;

}
