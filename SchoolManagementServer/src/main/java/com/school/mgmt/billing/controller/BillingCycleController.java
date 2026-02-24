package com.school.mgmt.billing.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.school.mgmt.billing.dto.CollectionRequestDTO;
import com.school.mgmt.billing.dto.CollectionResponseDTO;
import com.school.mgmt.billing.dto.GenerateBillingRequestDTO;
import com.school.mgmt.billing.entity.BillingCycle;
import com.school.mgmt.billing.service.BillingCycleService;
import com.school.utilslibrary.constant.billing.BillingCycleStatus;
import com.school.utilslibrary.restapi.ApiResponse;
import com.school.utilslibrary.restapi.ApiResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v2/billing-cycles")
@RequiredArgsConstructor
public class BillingCycleController {

	private final BillingCycleService billingCycleService;

	@PostMapping("/generate-range")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<List<?>> generateRangeBillings(@RequestBody GenerateBillingRequestDTO request) {
		List<?> generatedBillings = billingCycleService.generateBillingForRangeStudents(request);

		return ApiResponseBuilder.success("Generate successfully", generatedBillings, null);
	}
	
	@PostMapping("/collection-range")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse<List<?>> generateRangeBillings(@RequestBody CollectionRequestDTO request) {
		List<CollectionResponseDTO> collected = billingCycleService.processCollections(request);

		return ApiResponseBuilder.success("Collection successfully", collected, null);
	}

    @GetMapping("/filter")
	public ResponseEntity<ApiResponse<?>> filterBillingCycles(
			@RequestParam(required = false) BillingCycleStatus status,
            @RequestParam(required = false) String studentCode,
            @RequestParam(required = false) Long enrollmentId,
            @RequestParam(required = false) Integer cycleNum,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Page<BillingCycle> billingCycles = billingCycleService.getFilteredBillingCycles(status, studentCode, enrollmentId, cycleNum, startDate, endDate, page, size);

		// Constructing metadata (example: page details)
		Object meta = Map.of("currentPage", billingCycles.getNumber(), "totalPages", billingCycles.getTotalPages(),
				"totalItems", billingCycles.getTotalElements(), "pageSize", billingCycles.getSize());

		// Creating the API response
		ApiResponse<Page<BillingCycle>> response = ApiResponseBuilder.success("Billing cycles retrieved successfully.",
				billingCycles, null);

		return ResponseEntity.ok(response);
	}
}
