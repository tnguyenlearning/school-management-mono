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
@Table(name = "anum_tracker", uniqueConstraints = @UniqueConstraint(columnNames = { "type",
		"number" }, name = "UK_autoNumber"))
public class AnumTracker {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "Anum type cannot be empty")
	@Enumerated(EnumType.STRING)
	private AnumType type;

	@NotNull(message = "Current sequence cannot be empty")
	private Integer currentSequence;

}
