package com.school.utilslibrary.exception;

public class CustomUniqueConstraintViolationException extends RuntimeException {

	public CustomUniqueConstraintViolationException(String message) {
		super(message);
	}
}
