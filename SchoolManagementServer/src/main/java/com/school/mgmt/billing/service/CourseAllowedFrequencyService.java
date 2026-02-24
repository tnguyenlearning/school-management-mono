package com.school.mgmt.billing.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.school.mgmt.billing.entity.BillingFrequencyOption;
import com.school.mgmt.billing.entity.CourseAllowedFrequency;
import com.school.mgmt.billing.repository.BillingFrequencyOptionRepository;
import com.school.mgmt.billing.repository.CourseAllowedFrequencyRepository;
import com.school.utilslibrary.clients.billing.dtos.AllowedFrequencyRequest;
import com.school.utilslibrary.exception.NotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseAllowedFrequencyService {
	private final CourseAllowedFrequencyRepository allowedFrequencyRepository;
	private final BillingFrequencyOptionRepository billingFrequencyOptionRepository;

	@Transactional
	public void update(Long courseId, List<AllowedFrequencyRequest> request) {
		List<CourseAllowedFrequency> dbAllowedFreqs = allowedFrequencyRepository.findByCourseId(courseId);

		// Update existing and add new entries
		for (AllowedFrequencyRequest req : request) {
			boolean found = false;
			for (CourseAllowedFrequency dbFreq : dbAllowedFreqs) {
				if (dbFreq.getBillingFrequencyOptionId().equals(req.getBillingFrequencyOptionId())) {
					// Update existing entry
					dbFreq.setAllowedDate(req.getAllowedDate());
					allowedFrequencyRepository.save(dbFreq);
					found = true;
					break;
				}
			}
			if (!found) {
				// Add new entry
				BillingFrequencyOption dbpption = billingFrequencyOptionRepository
						.findById(req.getBillingFrequencyOptionId()).orElseThrow(() -> new NotFoundException(
								"BillingFrequencyOption with ID " + req.getBillingFrequencyOptionId() + " not found."));
				CourseAllowedFrequency newFreq = new CourseAllowedFrequency();
				newFreq.setCourseId(courseId);
				newFreq.setBillingFrequencyOption(dbpption);
				newFreq.setAllowedDate(req.getAllowedDate());
				allowedFrequencyRepository.save(newFreq);
			}
		}

		// Remove entries not in the request
		for (CourseAllowedFrequency dbFreq : dbAllowedFreqs) {
			boolean found = false;
			for (AllowedFrequencyRequest req : request) {
				if (dbFreq.getBillingFrequencyOptionId().equals(req.getBillingFrequencyOptionId())) {
					found = true;
					break;
				}
			}
			if (!found) {
				allowedFrequencyRepository.delete(dbFreq);
			}
		}
	}

	@Transactional
	public CourseAllowedFrequency save(CourseAllowedFrequency request) {
		return allowedFrequencyRepository.save(request);
	}

}
