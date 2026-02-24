package com.school.mgmt.billing.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.school.mgmt.billing.controller.StudentAccountDetailsDTO;
import com.school.mgmt.billing.entity.StudentAccount;
import com.school.mgmt.billing.repository.StudentAccountRepository;
import com.school.mgmt.education.enrollment.repository.StudentRepository;
import com.school.utilslibrary.constant.StudentAccountType;
import com.school.utilslibrary.exception.BadRequestException;
import com.school.utilslibrary.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentAccountService {

	private final StudentAccountRepository repository;
	private final StudentRepository studentRepository;

	@Transactional
	public StudentAccount create(StudentAccount studentAccount) {
		if (!studentRepository.existsByStudentCode(studentAccount.getStudentCode())) {
			throw new BadRequestException("Student code " + studentAccount.getStudentCode() + " not found");
		}
		studentAccount.setBalanceAmount(BigDecimal.ZERO);
		return repository.save(studentAccount);
	}

	public Page<List<StudentAccount>> findStudentAccounts(String phone, String firstName, String studentCode,
			StudentAccountType type, Pageable pageable) {
		List<String> studentCodes = studentRepository.findStudentCodeContaining(phone, studentCode, firstName);
		return repository.findStudentAccounts(studentCodes, studentCode, type, pageable);
	}

	public StudentAccountDetailsDTO getStudentAccountDetails(Long studentAccountId) {
//		StudentAccount studentAccount = this.findById(studentAccountId);
//		List<Receipt> receipts = receiptRepository.findByStudentAccountId(studentAccountId);
//		List<Payment> payments = paymentRepository.findByStudentAccountId(studentAccountId);
//		return new StudentAccountDetailsDTO(studentAccount, receipts, payments);
		return null;
	}

	public StudentAccount findById(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new NotFoundException("StudentAccount with ID " + id + " not found."));
	}
	
	public StudentAccount findByStudentCode(String studentCode) {
		return repository.findByStudentCode(studentCode)
			.orElseThrow(() -> new NotFoundException("StudentAccount not found for studentCode: " + studentCode));
	}

	public StudentAccount save(StudentAccount studentAccount) {
		return repository.save(studentAccount);
	}

}
