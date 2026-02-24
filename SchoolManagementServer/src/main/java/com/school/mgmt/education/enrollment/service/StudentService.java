package com.school.mgmt.education.enrollment.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.school.mgmt.billing.entity.StudentAccount;
import com.school.mgmt.billing.repository.StudentAccountRepository;
import com.school.mgmt.education.enrollment.entities.Student;
import com.school.mgmt.education.enrollment.repository.StudentRepository;
import com.school.mgmt.util.autonum.service.AutoNumberService;
import com.school.utilslibrary.constant.AnumType;
import com.school.utilslibrary.constant.StudentAccountType;
import com.school.utilslibrary.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

	private final StudentRepository studentRepository;
	private final StudentAccountRepository accountRepository;
	private final AutoNumberService autoNumberService;

	public Student findById(Long studentId) {
		Student student = studentRepository.findById(studentId)
				.orElseThrow(() -> new NotFoundException("Student not found"));
		return student;
	}

	@Transactional
	public Student create(Student student) {
		Student createdStudent = studentRepository.save(student);
		
		StudentAccount account = new StudentAccount();
		account.setBalanceAmount(BigDecimal.ZERO);
		account.setStudentCode(createdStudent.getStudentCode());
		account.setType(StudentAccountType.REGULAR);
		accountRepository.save(account);
		
		autoNumberService.deleteReservedNumber(AnumType.STUDENT, createdStudent.getStudentCode());

		return createdStudent;
	}

}
