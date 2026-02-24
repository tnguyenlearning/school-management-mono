package com.school.mgmt.billing.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.school.mgmt.billing.service.CourseAllowedFrequencyService;
import com.school.utilslibrary.clients.billing.dtos.AllowedFrequencyRequest;
import com.school.utilslibrary.restapi.ApiResponse;
import com.school.utilslibrary.restapi.ApiResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v2/course-allowed-frequency")
@RequiredArgsConstructor
public class CourseAllowedFrequencyController {

	private final CourseAllowedFrequencyService allowedFrequencyService;
	
	@PutMapping("/courses/{courseId}")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<?> createCourse(@PathVariable Long courseId, @RequestBody List<AllowedFrequencyRequest> request) {
		allowedFrequencyService.update(courseId, request);
		return ApiResponseBuilder.success("Course Allowed Frequency Updated successfully", null, null);
	}

//	// Endpoint to process a refund (create the refund record)
//	@PostMapping("/processRefund")
//	public ResponseEntity<Refund> processRefund(@RequestParam String paymentId, @RequestParam String invoiceId,
//			@RequestParam BigDecimal refundAmount) {
//
//		Refund refund = refundService.processRefund(paymentId, invoiceId, refundAmount);
//		return ResponseEntity.ok(refund);
//	}
//
//	// Endpoint to handle the payout (transfer money to student and update status)
//	@PostMapping("/processPayout")
//	public ResponseEntity<Long> processPayout(@RequestParam String refundId, @RequestParam BigDecimal refundAmount) {
//
//		Refund refund = refundService.findById(refundId);
//
//		// Process the payout and update the statuses
//		refundService.processPayout(refund, refundAmount);
//		return ResponseEntity.ok("Payout processed successfully");
//	}
}
