package com.school.mgmt.billing.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDTO {

	private String invoiceId;
	private String studentId;
    private BigDecimal amount; // Used only for PARTIAL payments
	private LocalDate paymentDate;

}
