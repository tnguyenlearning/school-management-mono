package com.school.mgmt.billing.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.school.mgmt.billing.entity.CourseDiscount;
import com.school.mgmt.billing.entity.Discount;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseDiscountService {

	public BigDecimal calculateTotalDiscountAmount(BigDecimal feeAmount, LocalDate effDate,
			List<CourseDiscount> courseDiscounts) {
		BigDecimal totalDiscountAmount = BigDecimal.ZERO;

		for (CourseDiscount cDiscount : courseDiscounts) {
			// Check if the discount is valid and falls within the effective date range
			if (cDiscount.getIsActive() && !cDiscount.getValidFrom().isAfter(effDate)
					&& !cDiscount.getValidTo().isBefore(effDate)) {
				Discount discount = cDiscount.getDiscount();
				BigDecimal discountValue = discount.getValue();
				switch (discount.getType()) {
				case PERCENTAGE:
					// Calculate percentage-based discount
					BigDecimal percentageDiscount = feeAmount.multiply(discountValue)
							.divide(BigDecimal.valueOf(100));
					totalDiscountAmount = totalDiscountAmount.add(percentageDiscount);
					break;

				case FIXED_AMOUNT:
					totalDiscountAmount = totalDiscountAmount.add(discountValue);
					break;

				default:
					throw new IllegalArgumentException("Unknown discount type: " + discount.getType());
				}
			}
		}

		return totalDiscountAmount;
	}

}
