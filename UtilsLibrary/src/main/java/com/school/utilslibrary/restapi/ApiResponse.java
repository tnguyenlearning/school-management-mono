package com.school.utilslibrary.restapi;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

	private String status; // "success", "error", "validation_error"
	private String message; // A brief message about the operation
	private T data; // The actual response data
	private Object meta; // Metadata (e.g., pagination info)
	private Object errors; // Errors, if any

}