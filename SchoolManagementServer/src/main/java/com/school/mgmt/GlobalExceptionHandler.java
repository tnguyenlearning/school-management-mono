package com.school.mgmt;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.school.utilslibrary.exception.BadRequestException;
import com.school.utilslibrary.exception.CustomUniqueConstraintViolationException;
import com.school.utilslibrary.exception.ErrorResponseDTO;
import com.school.utilslibrary.exception.NotFoundException;

import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler {
	private static final String RECORD_NOT_FOUND = "Record not found!";

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleException(Exception e) {
		e.printStackTrace();
		ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR.toString(),
				e.getMessage());
		return new ResponseEntity<>(errorResponseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {

		BindingResult bindingResult = ex.getBindingResult();
		String errorMessages = bindingResult.getFieldErrors().stream().map(error -> error.getDefaultMessage())
				.collect(Collectors.joining(", "));
		ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(HttpStatus.BAD_REQUEST.toString(), errorMessages);
		return new ResponseEntity<>(errorResponseDTO, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<?> handleBadRequestException(BadRequestException e) {
		ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(HttpStatus.BAD_REQUEST.toString(), e.getMessage());
		return new ResponseEntity<>(errorResponseDTO, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<?> handleNoResourceFoundException(Exception e) {
		ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(HttpStatus.NOT_FOUND.toString(), "Not found");
		return new ResponseEntity<>(errorResponseDTO, HttpStatus.NOT_FOUND);
	}

	// Handle constraint violation error
	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ErrorResponseDTO> handleConstraintViolationException(ConstraintViolationException e) {
		String errorMessages = e.getConstraintViolations().stream().map(violation -> violation.getMessage())
				.collect(Collectors.joining(", "));
		ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(HttpStatus.BAD_REQUEST.toString(), errorMessages);
		return new ResponseEntity<>(errorResponseDTO, HttpStatus.BAD_REQUEST);
	}

	// Handle not found error
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleNotFoundException(ResourceNotFoundException e) {
		return new ResponseEntity<>(new ErrorResponseDTO(HttpStatus.NOT_FOUND.toString(), RECORD_NOT_FOUND),
				HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(CustomUniqueConstraintViolationException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ErrorResponseDTO handleValidationExceptions(CustomUniqueConstraintViolationException e) {
		return new ErrorResponseDTO(HttpStatus.BAD_REQUEST.toString(), e.getMessage());
	}

	// SQL Server Exception
	// @ExceptionHandler
	// public ResponseEntity<ErrorResponse>
	// handleSQLServerException(SQLServerException e) {
	// return new ResponseEntity<>(new
	// ErrorResponse(HttpStatus.NOT_FOUND, "Record not found!"),
	// HttpStatus.NOT_FOUND);
	// }

	@ExceptionHandler(DataIntegrityViolationException.class)

	public ResponseEntity<ErrorResponseDTO> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
		// List to store error messages for each violated constraint
		List<String> errorMessages = new ArrayList<>();

		// Check if there's a cause and extract the message from the cause
		if (ex.getCause() != null && ex.getCause().getMessage() != null) {
			String causeMessage = ex.getCause().getMessage();

			// Check for the constraint violations in the cause message
			if (causeMessage.contains("UK_email")) {
				errorMessages.add("Email must be unique");
			}
			if (causeMessage.contains("UK_student_code")) {
				errorMessages.add("Student code must be unique");
			}

			if (causeMessage.contains("UK_code")) {
				errorMessages.add("Course code must be unique");
			}

			if (causeMessage.contains("UK_enrollmentNum")) {
				errorMessages.add("Enrollment Number must be unique");
			}
			
			if (causeMessage.contains("uk_leave_student_session")) {
				errorMessages.add("Leave request must be unique");
			}

			// If no specific column violations found, provide a generic message
			if (errorMessages.isEmpty()) {
				errorMessages.add("A unique constraint violation occurred. Please check your input.");
			}
		}

		// Return a response with all detected constraint violations
		ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(HttpStatus.BAD_REQUEST.toString(),
				String.join(", ", errorMessages));

		return new ResponseEntity<>(errorResponseDTO, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleStudentNotFoundException(NotFoundException e) {
		ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(HttpStatus.BAD_REQUEST.toString(), e.getMessage());

		return new ResponseEntity<>(errorResponseDTO, HttpStatus.BAD_REQUEST);
	}

}
