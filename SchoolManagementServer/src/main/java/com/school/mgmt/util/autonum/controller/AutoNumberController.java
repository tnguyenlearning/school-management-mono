package com.school.mgmt.util.autonum.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.school.mgmt.util.autonum.dto.AssignNumberResponse;
import com.school.mgmt.util.autonum.dto.GenerateNumberRequest;
import com.school.mgmt.util.autonum.dto.ReclaimNumberRequest;
import com.school.mgmt.util.autonum.service.AutoNumberService;
import com.school.utilslibrary.clients.utils.ConfirmNumberRequest;
import com.school.utilslibrary.constant.AnumType;
import com.school.utilslibrary.restapi.ApiResponse;
import com.school.utilslibrary.restapi.ApiResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v2/auto-numbers")
@RequiredArgsConstructor
public class AutoNumberController {

	private final AutoNumberService autoNumberService;

	@PostMapping("/reserve")
	public ApiResponse<?> assignNumber(@RequestBody AnumType type) {
		AssignNumberResponse response = autoNumberService.reserveNumber(type);
		return ApiResponseBuilder.success("Reserve success", response, null);
	}

	@PostMapping("/confirm")
	public ApiResponse<?> confirmNumber(@RequestBody ConfirmNumberRequest request) {
		autoNumberService.deleteReservedNumber(request.getType(), request.getNumber());
		return ApiResponseBuilder.success("Delete number success", null, null);
	}

	@PostMapping("/reclaim")
	public ApiResponse<?> reclaimNumber(@RequestBody ReclaimNumberRequest request) {
		autoNumberService.reclaimReservedNumber(request.getType(), request.getNumber());
		return ApiResponseBuilder.success("Reclaim success", null, null);
	}

	@PostMapping("/generate")
	public ApiResponse<?> generateNumbers(@RequestBody GenerateNumberRequest request) {
		autoNumberService.generateNumbers(request.getType(), request.getPrefix(), request.getCount());
		return ApiResponseBuilder.success("Generate success", null, null);
	}

}