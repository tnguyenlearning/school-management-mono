package com.school.utilslibrary.clients.education.dtos;

import java.math.BigDecimal;

import com.school.utilslibrary.constant.StudentAccountType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentAccountDTO {

	private String studentCode;

	private BigDecimal balanceAmount;

	private StudentAccountType type;

}
