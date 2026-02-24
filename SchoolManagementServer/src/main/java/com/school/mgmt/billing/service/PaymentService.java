package com.school.mgmt.billing.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
//
//	private final PaymentRepository paymentRepository;
//
//	private final InvoiceService invoiceService;
//
//	private final ReceiptService receiptService;
//
//	@Transactional
//	public boolean processPayment(PaymentRequestDTO request) {
//		String studentId = request.getStudentId();
//		String invoiceId = request.getInvoiceId();
//		BigDecimal partialAmount = request.getAmount();
//
//		// Retrieve and validate the invoice
//		Invoice invoice = invoiceService.findById(invoiceId);
//		PaymentType paymentType = invoice.getPaymentType();
////		BigDecimal TotalFee = invoice.getTotalFee();
//
//		// Retrieve student receipts with balances
//		List<Receipt> receipts = receiptService.getReceiptsWithBalanceGreaterThanZero(studentId);
//		BigDecimal totalBalance = calcTotalBalance(receipts);
//
//		// Determine the payment amount
//		//BigDecimal paymentAmount = calcPaymentAmount(paymentType, TotalFee, partialAmount, totalBalance);
//
//		// Apply receipts to payment
////		boolean isCovered = applyReceiptsToPayment(receipts, paymentAmount);
////		if (isCovered) {
////			updateInvoiceAndCreatePayment(invoice, paymentAmount);
////		}
//
//		//return isCovered;
//		
//		return false;
//	}
//
//	private BigDecimal calcTotalBalance(List<Receipt> receipts) {
//		return receipts.stream().map(Receipt::getBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
//	}
//
//	private BigDecimal calcPaymentAmount(PaymentType paymentType, BigDecimal TotalFee, BigDecimal partialAmount,
//			BigDecimal totalBalance) {
//		switch (paymentType) {
//		case PARTIAL:
//			calcPartialPayment(partialAmount, TotalFee, totalBalance);
//			return partialAmount;
//		case HALF:
//			return calcHalfPayment(TotalFee, totalBalance);
//		case COMPLETE:
//			calcCompletePayment(TotalFee, totalBalance);
//			return TotalFee;
//		default:
//			throw new IllegalArgumentException("Invalid payment type");
//		}
//	}
//
//	private void calcPartialPayment(BigDecimal partialAmount, BigDecimal TotalFee, BigDecimal totalBalance) {
//		if (partialAmount == null || partialAmount.compareTo(BigDecimal.ZERO) <= 0) {
//			throw new BadRequestException("Partial payment amount must be greater than zero");
//		}
//		if (partialAmount.compareTo(TotalFee) > 0) {
//			throw new BadRequestException("Partial payment amount cannot exceed amount due");
//		}
//		if (partialAmount.compareTo(totalBalance) > 0) {
//			throw new BadRequestException("Partial payment amount cannot exceed total balance");
//		}
//	}
//
//	private BigDecimal calcHalfPayment(BigDecimal TotalFee, BigDecimal totalBalance) {
//		BigDecimal halfAmount = TotalFee.divide(BigDecimal.valueOf(2), RoundingMode.HALF_UP);
//		if (halfAmount.compareTo(totalBalance) > 0) {
//			throw new BadRequestException("Total balance cannot cover half the amount due");
//		}
//		return halfAmount;
//	}
//
//	private void calcCompletePayment(BigDecimal TotalFee, BigDecimal totalBalance) {
//		if (TotalFee.compareTo(totalBalance) > 0) {
//			throw new BadRequestException("Total balance cannot cover the complete amount due");
//		}
//	}
//
//	private boolean applyReceiptsToPayment(List<Receipt> receipts, BigDecimal paymentAmount) {
//		if (receipts.isEmpty()) {
//			return false; // No receipts available to cover the payment
//		}
//
//		BigDecimal remainingAmount = paymentAmount;
//
//		for (Receipt receipt : receipts) {
//			if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0)
//				break;
//
//			BigDecimal availableBalance = receipt.getBalance();
//
//			if (availableBalance.compareTo(remainingAmount) >= 0) {
//				receipt.setBalance(availableBalance.subtract(remainingAmount));
//				remainingAmount = BigDecimal.ZERO;
//			} else {
//				receipt.setBalance(BigDecimal.ZERO);
//				remainingAmount = remainingAmount.subtract(availableBalance);
//			}
//		}
//
//		if (remainingAmount.compareTo(BigDecimal.ZERO) == 0) {
//			receiptService.saveAll(receipts);
//			return true;
//		}
//
//		return false;
//	}
//
//	private void updateInvoiceAndCreatePayment(Invoice invoice, BigDecimal paymentAmount) {
//		// Update the invoice
////		invoice.setTotalFee(invoice.getTotalFee().subtract(paymentAmount));
////		invoice.setTotalPaid(invoice.getTotalPaid().add(paymentAmount));
////
////		if (invoice.getTotalFee().compareTo(BigDecimal.ZERO) == 0) {
////			invoice.setStatus(InvoiceStatus.PAID);
////		} else {
////			invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
////		}
////		invoiceService.save(invoice);
//
//		// Create and save a new payment
//		Payment payment = new Payment();
//		payment.setInvoice(invoice);
//		payment.setAmountPaid(paymentAmount);
//		payment.setEffdate(LocalDate.now());
//		paymentRepository.save(payment);
//	}

}
