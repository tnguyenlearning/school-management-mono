package com.school.utilslibrary.restapi;

public class ApiResponseBuilder {

	public static <T> ApiResponse<T> success(String message, T data, Object meta) {
		return new ApiResponse<>("success", message, data, meta, null);
	}

	public static ApiResponse<?> validationError(String message, Object errors) {
		return new ApiResponse<>("validation_error", message, null, null, errors);
	}

	public static ApiResponse<?> error(String message) {
		return new ApiResponse<>("error", message, null, null, null);
	}

}
