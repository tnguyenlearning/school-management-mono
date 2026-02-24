package com.school.mgmt.education.enrollment.entities;

import com.school.utilslibrary.constant.Gender;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student", uniqueConstraints = { @UniqueConstraint(columnNames = "email", name = "UK_email"),
		@UniqueConstraint(columnNames = "student_code", name = "UK_student_code") })
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Student {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Student Code cannot be empty")
	@Column(nullable = false)
	private String studentCode;

	@NotBlank(message = "Student Code cannot be empty")
	@Column(nullable = false)
	private String firstName;

	@NotBlank(message = "Student Code cannot be empty")
	@Column(nullable = false)
	private String lastName;

	@Column(nullable = false)
	@NotNull(message = "Gender cannot be empty")
	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(nullable = false)
	@Min(value = 0, message = "Age must be at least 0")
	@Max(value = 100, message = "Age must not exceed 100")
	private int age;

	@Column(nullable = false)
	@Email(message = "Must enter email")
	private String email;

	@Column(nullable = false)
	@Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Phone number must be valid (e.g., +1234567890 or 1234567890)")
	@NotBlank(message = "Phone number cannot be empty")
	private String phoneNumber;

	@Column(nullable = false)
	@NotBlank(message = "Address cannot be empty")
	private String address;

}
