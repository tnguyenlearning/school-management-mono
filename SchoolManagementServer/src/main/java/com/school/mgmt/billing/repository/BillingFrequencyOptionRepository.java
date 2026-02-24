package com.school.mgmt.billing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.mgmt.billing.entity.BillingFrequencyOption;

@RepositoryRestResource(path = "billing-frequency")
public interface BillingFrequencyOptionRepository extends JpaRepository<BillingFrequencyOption, Long> {
}