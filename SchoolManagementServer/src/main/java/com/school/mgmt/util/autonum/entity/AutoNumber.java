package com.school.mgmt.util.autonum.entity;

import com.school.utilslibrary.constant.AnumType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "autonumber", uniqueConstraints = @UniqueConstraint(columnNames = { "type", "number" }, name = "UK_autoNumber"))
public class AutoNumber {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "Anum type cannot be empty")
	@Enumerated(EnumType.STRING)
	private AnumType type;

	@NotNull(message = "Anum number cannot be empty")
	private String number;

	@NotNull(message = "Anum prefix cannot be empty")
	private String prefix;

	@Builder.Default
	@NotNull(message = "Reservation status cannot be null")
	private Boolean reserved = false; // New field for reservation

	public AutoNumber(@NotNull(message = "Anum type cannot be empty") AnumType type,
			@NotNull(message = "Anum number cannot be empty") String number,
			@NotNull(message = "Anum prefix cannot be empty") String prefix,
			@NotNull(message = "Reservation status cannot be null") Boolean reserved) {
		super();
		this.type = type;
		this.number = number;
		this.prefix = prefix;
		this.reserved = reserved;
	}

}
