package com.school.utilslibrary.clients.billing.dtos;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BulkNextBillingDateRequest {

	private List<Long> enrollmentIds;

	private LocalDate nextBillingDate;

}
