package com.school.utilslibrary.clients.billing.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataForBillingRequest {

	private List<Long> enrollmentIds;

}
