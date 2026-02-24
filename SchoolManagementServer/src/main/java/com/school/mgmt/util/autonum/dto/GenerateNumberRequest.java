package com.school.mgmt.util.autonum.dto;

import com.school.utilslibrary.constant.AnumType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GenerateNumberRequest {

	private AnumType type;
	private String prefix;
	private int count;

}
