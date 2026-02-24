package com.school.mgmt.billing.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PenaltyService {

//	private static final BigDecimal PENALTY_RATE = BigDecimal.valueOf(0.05); // 5% penalty
//	private static final BigDecimal MIN_PENALTY = BigDecimal.valueOf(10); // Minimum penalty
//
//	/**
//	 * Calculate penalty for a late payment.
//	 */
//	public BigDecimal calculateLatePenalty(BigDecimal remainingAmount, String daysLate) {
//		if (daysLate <= 0) {
//			return BigDecimal.ZERO; // No penalty if not late
//		}
//
//		BigDecimal penalty = remainingAmount.multiply(PENALTY_RATE).multiply(BigDecimal.valueOf(daysLate));
//		return penalty.max(MIN_PENALTY); // Ensure minimum penalty is applied
//	}
//
//	/**
//	 * Apply penalty to an overdue invoice.
//	 */
//	public void applyPenalty(Invoice invoice) {
////		LocalDate today = LocalDate.now();
////		if (invoice.getDueDate().isBefore(today) && invoice.getStatus() != InvoiceStatus.PAID) {
////			String daysLate = java.time.temporal.ChronoUnit.DAYS.between(invoice.getDueDate(), today);
////			BigDecimal penalty = calculateLatePenalty(invoice.getTotalFee().subtract(invoice.getTotalPaid()),
////					daysLate);
////			//invoice.setPenaltyAmount(penalty);
////		}
//	}

}
