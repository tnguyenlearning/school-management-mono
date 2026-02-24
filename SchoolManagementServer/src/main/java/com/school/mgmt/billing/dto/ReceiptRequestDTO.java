package com.school.mgmt.billing.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.school.mgmt.billing.entity.StudentAccount;
import com.school.utilslibrary.constant.billing.PaymentMethod;

import lombok.Data;

@Data
public class ReceiptRequestDTO {
    private StudentAccount studentAccount;
    private BigDecimal amount;
    private LocalDate receiptDate;
    private String remark;
    private PaymentMethod paymentMethod;
}
