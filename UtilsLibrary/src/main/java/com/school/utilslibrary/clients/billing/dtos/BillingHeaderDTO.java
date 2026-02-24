package com.school.utilslibrary.clients.billing.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillingHeaderDTO {

	private Long enrollmentId;

	private String studentCode;

	private String billingFrequencyOption;

	private LocalDate nextBillingDate;

}
