package com.school.mgmt.billing.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.school.mgmt.billing.entity.CourseDiscount;
import com.school.mgmt.billing.entity.Discount;
import com.school.mgmt.billing.entity.EnrollmentDiscount;
import com.school.mgmt.billing.repository.CourseDiscountRepository;
import com.school.mgmt.billing.repository.EnrollmentDiscountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiscountService {

	private final EnrollmentDiscountRepository enrollmentDiscountRepository;
	private final CourseDiscountRepository courseDiscountRepository;

	public BigDecimal calculateTotalDiscountAmount(BigDecimal feeAmount, LocalDate effDate, Long enrollmentId,
			String courseCode) {

		List<EnrollmentDiscount> enrollmentDiscounts = enrollmentDiscountRepository.findAllByEnrollmentId(enrollmentId);
		List<CourseDiscount> courseDiscounts = courseDiscountRepository.findAllByCourseCode(courseCode);

		List<Discount> discounts = new ArrayList<>();

		for (EnrollmentDiscount e : enrollmentDiscounts) {
			if (e.getIsActive() && !e.getValidFrom().isAfter(effDate) && !e.getValidTo().isBefore(effDate)
					&& e.getRemainingUses() > 0) {
				discounts.add(e.getDiscount());
			}
		}
		for (CourseDiscount c : courseDiscounts) {
			if (c.getIsActive() && !c.getValidFrom().isAfter(effDate) && !c.getValidTo().isBefore(effDate)
					&& c.getRemainingUses() > 0) {
				discounts.add(c.getDiscount());
			}
		}

		return calculateDiscounts(feeAmount, discounts);
	}

	private <T> BigDecimal calculateDiscounts(BigDecimal feeAmount, List<Discount> discounts) {
		BigDecimal totalDiscountAmount = BigDecimal.ZERO;

		for (Discount d : discounts) {
			BigDecimal discountValue = d.getValue();
			switch (d.getType()) {
			case PERCENTAGE:
				// Calculate percentage-based discount
				BigDecimal percentageDiscount = feeAmount.multiply(discountValue).divide(BigDecimal.valueOf(100));
				totalDiscountAmount = totalDiscountAmount.add(percentageDiscount);
				break;

			case FIXED_AMOUNT:
				totalDiscountAmount = totalDiscountAmount.add(discountValue);
				break;

			default:
				throw new IllegalArgumentException("Unknown discount type: " + d.getType());
			}
		}

		return totalDiscountAmount;
	}
}
