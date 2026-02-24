package com.school.mgmt.billing.service;

import org.springframework.stereotype.Service;

import com.school.mgmt.billing.entity.Receipt;
import com.school.mgmt.billing.entity.StudentAccount;
import com.school.mgmt.billing.repository.ReceiptRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReceiptService {

	private final ReceiptRepository receiptRepository;
	private final StudentAccountService studentAccountService;

	@Transactional
	public Receipt create(String studentCode, Receipt request) {
		StudentAccount stAccount = studentAccountService.findByStudentCode(studentCode);
		stAccount.setBalanceAmount(stAccount.getBalanceAmount().add(request.getAmount()));
		studentAccountService.save(stAccount);
		
		request.setStudentAccount(stAccount);
		return receiptRepository.save(request);
	}

}
