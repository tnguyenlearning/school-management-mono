package com.school.mgmt.util.autonum.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.school.mgmt.util.autonum.dto.AssignNumberResponse;
import com.school.mgmt.util.autonum.entity.AutoNumber;
import com.school.mgmt.util.autonum.repository.AnumTrackerRepository;
import com.school.mgmt.util.autonum.repository.AutoNumberRepository;
import com.school.utilslibrary.constant.AnumType;
import com.school.utilslibrary.exception.NumberPoolExhaustedException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AutoNumberService {

	private final AutoNumberRepository autoNumberRepository;
	private final AnumTrackerRepository anumTrackerRepository;

	@Transactional
	public AssignNumberResponse reserveNumber(AnumType type) {
		Optional<AutoNumber> autoNumber = autoNumberRepository.findFirstByTypeAndReservedFalseOrderByNumberAsc(type);

		if (autoNumber.isEmpty()) {
			throw new NumberPoolExhaustedException(
					"No available numbers for type: " + type + ". Please generate new numbers.");
		}

		AutoNumber reservedNumber = autoNumber.get();
		autoNumberRepository.updateReservationStatus(reservedNumber.getId(), true);

		return AssignNumberResponse.builder().number(reservedNumber.getNumber()).prefix(reservedNumber.getPrefix())
				.build();
	}

	@Transactional
	public void deleteReservedNumber(AnumType type, String number) {
		Optional<AutoNumber> autoNumber = autoNumberRepository.findByTypeAndNumberAndReservedTrue(type, number);

		if (autoNumber.isEmpty() || !autoNumber.get().getNumber().equals(number)) {
			throw new RuntimeException("Number " + number + " is not reserved or does not exist.");
		}

		// Delete the reserved number as it has been assigned
		autoNumberRepository.delete(autoNumber.get());
	}

	@Transactional
	public void reclaimReservedNumber(AnumType type, String number) {
		Optional<AutoNumber> autoNumber = autoNumberRepository.findByTypeAndNumberAndReservedTrue(type, number);

		if (autoNumber.isEmpty() || !autoNumber.get().getNumber().equals(number)) {
			throw new RuntimeException("Number " + number + " is not reserved or does not exist.");
		}
		autoNumberRepository.updateReservationStatus(autoNumber.get().getId(), false);

	}

	@Transactional
	public void generateNumbers(AnumType type, String prefix, int count) {
		Integer currentSequence = anumTrackerRepository.findCurrentSequenceByType(type);
		int nextSequence = (currentSequence == null) ? 0 : currentSequence;

		for (int i = 1; i <= count; i++) {
			String number = prefix + String.format("%05d", nextSequence + i); // Format as 'prefix00001'
			AutoNumber autoNumber = new AutoNumber(type, number, prefix, false);
			autoNumberRepository.save(autoNumber);
		}

		int newCurrentSequence = nextSequence + count;
		if (currentSequence == null) {
			anumTrackerRepository.insertCurrentSequence(type, newCurrentSequence);
		} else {
			anumTrackerRepository.updateCurrentSequence(type, newCurrentSequence);
		}
	}

}
