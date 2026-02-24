package com.school.mgmt.billing.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.school.mgmt.billing.entity.StudentAccount;
import com.school.mgmt.billing.service.StudentAccountService;
import com.school.utilslibrary.constant.StudentAccountType;
import com.school.utilslibrary.restapi.ApiResponse;
import com.school.utilslibrary.restapi.ApiResponseBuilder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v2/student-accounts")
@RequiredArgsConstructor
public class StudentAccountController {

    private final StudentAccountService studentAccountService;

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/search/findStudentAccounts")
    public ApiResponse< Page<List<StudentAccount>>> findStudentAccounts(
    		@RequestParam(required = false) String phone,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String studentCode,
            @RequestParam(required = false) StudentAccountType type,
            Pageable pageable) {
        Page<List<StudentAccount>> result = studentAccountService.findStudentAccounts(phone, firstName, studentCode, type, pageable);
        return ApiResponseBuilder.success("Student accounts retrieved successfully", result, null);
    }
    
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{studentAccountId}/details")
    public ResponseEntity<StudentAccountDetailsDTO> getTransactions(@PathVariable Long studentAccountId) {
        return ResponseEntity.ok(studentAccountService.getStudentAccountDetails(studentAccountId));
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ApiResponse<StudentAccount> createStudentAccount(@Valid @RequestBody StudentAccount studentAccount) {
        StudentAccount createdAccount = studentAccountService.create(studentAccount);
        return ApiResponseBuilder.success("Student account created successfully", createdAccount, null);
    }

}
