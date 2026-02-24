package com.school.utilslibrary.clients.billing.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllowedFrequencyRequest {

	private Long billingFrequencyOptionId;
	private LocalDate allowedDate;

}
