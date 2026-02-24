package com.school.mgmt.billing.controller;

import java.util.List;

import com.school.mgmt.billing.entity.Payment;
import com.school.mgmt.billing.entity.Receipt;
import com.school.mgmt.billing.entity.StudentAccount;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentAccountDetailsDTO {

	private StudentAccount studentAccount;

	private List<Receipt> receipts;
	private List<Payment> payments;

}
