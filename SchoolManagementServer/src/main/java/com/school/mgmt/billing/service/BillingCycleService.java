package com.school.mgmt.billing.service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.school.mgmt.billing.dto.CollectionRequestDTO;
import com.school.mgmt.billing.dto.CollectionResponseDTO;
import com.school.mgmt.billing.dto.GenerateBillingRequestDTO;
import com.school.mgmt.billing.dto.GenerateBillingResponseDTO;
import com.school.mgmt.billing.entity.BillingCycle;
import com.school.mgmt.billing.entity.BillingFrequencyOption;
import com.school.mgmt.billing.entity.Payment;
import com.school.mgmt.billing.entity.StudentAccount;
import com.school.mgmt.billing.repository.BillingCycleRepository;
import com.school.mgmt.billing.repository.PaymentRepository;
import com.school.mgmt.education.course.entity.Course;
import com.school.mgmt.education.enrollment.entities.Enrollment;
import com.school.mgmt.education.enrollment.entities.Student;
import com.school.mgmt.education.enrollment.repositories.EnrollmentRepository;
import com.school.mgmt.education.session.entities.LeaveRequest;
import com.school.mgmt.education.session.repositories.LeaveRequestRepository;
import com.school.utilslibrary.clients.education.constants.CourseStatus;
import com.school.utilslibrary.constant.GlobalConstants;
import com.school.utilslibrary.constant.billing.BillingCycleStatus;
import com.school.utilslibrary.constant.billing.BillingCycleType;
import com.school.utilslibrary.constant.billing.Frequency;
import com.school.utilslibrary.constant.education.LeaveStatus;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Service
@RequiredArgsConstructor
public class BillingCycleService {

	private final BillingCycleRepository billingCycleRepository;
	private final DiscountService discountService;
	private final PaymentRepository paymentRepository;
	private final StudentAccountService studentAccountService;
	private final EnrollmentRepository enrollmentRepository;
	private final LeaveRequestRepository leaveRequestRepository;

	private LocalDate effDate = null;
	private String fromStudentCode = null;
	private String toStudentCode = null;

	@Transactional
	public List<?> generateBillingForRangeStudents(GenerateBillingRequestDTO request) {
		effDate = request.getEffDate() != null ? request.getEffDate() : LocalDate.now();
		fromStudentCode = request.getFromStudentCode() != "" ? request.getFromStudentCode() : "st00000";
		toStudentCode = request.getToStudentCode() != "" ? request.getFromStudentCode() : "st99999";

		List<GenerateBillingResponseDTO> billingResponse = new ArrayList<>();
		GenerateBillingResponseDTO dto = null;
		// can write leave feature at here
		// Get all active enrollments for the student
		List<Enrollment> enrollments = enrollmentRepository.getFilteredForBilling(fromStudentCode,
				toStudentCode, effDate);

		for (Enrollment enrollment : enrollments) {
			Course course = enrollment.getCourse();
			Student student = enrollment.getStudent();
			if (!course.getStatus().equals(CourseStatus.ONGOING)) {
				continue;
			}
			Set<DayOfWeek> learningDays = course.getDaysOfWeek();
			LocalDate endDate = enrollment.getEndDate();
			BillingFrequencyOption frequencyOption = enrollment.getBillingFrequencyOption();
			Integer totalLearningDays = frequencyOption.getTotalLearningDays();
			BigDecimal feeAmount = frequencyOption.getFeeAmount();
			Frequency frequency = frequencyOption.getFrequency();

			BigDecimal totalDiscount = discountService.calculateTotalDiscountAmount(feeAmount, effDate, enrollment.getId(), course.getCode());

			BillingCycle latestCycle = billingCycleRepository
					.findTopByEnrollmentIdOrderByCycleNumDesc(enrollment.getId()).orElse(null);
			int newCycleNum = latestCycle == null ? 1 : latestCycle.getCycleNum() + 1;

			LocalDate cycleStartDate = enrollment.getNextBillingDate();

			// Create a FREE billing cycle to compensate approved leaves (if any)
			GenerateBillingResponseDTO freeDto = handleLeavesAndMaybeCreateFreeCycle(enrollment, course, student, cycleStartDate, effDate);
			if (freeDto != null) {
				billingResponse.add(freeDto);
			}
			// refresh cycleStartDate after possible nextBillingDate update
			cycleStartDate = enrollment.getNextBillingDate();

			BillingPeriod billingPeriod;

			if (frequency == Frequency.LEARNING_PERIOD && totalLearningDays != null) {
				billingPeriod = calculateBillingPeriodByLearningDays(cycleStartDate, endDate,
						learningDays, totalLearningDays);
			} else if (frequency != null) {
				billingPeriod = calculateBillingPeriodByFrequency(cycleStartDate, endDate, frequency, learningDays);
			} else {
				throw new IllegalArgumentException("Either frequency or totalLearningDays must be specified.");
			}
			
			BillingCycle newCycle = new BillingCycle();
			newCycle.setCourseCode(course.getCode());
			newCycle.setStudentCode(student.getStudentCode());
			newCycle.setEnrollmentId(enrollment.getId());
			newCycle.setBillingFrequencyOption(frequencyOption);
			newCycle.setGeneratedDate(effDate);
			newCycle.setCycleStartDate(cycleStartDate);
			newCycle.setCycleEndDate(billingPeriod.getCycleEndDate());
			newCycle.setDueDate(billingPeriod.getCycleEndDate());
			newCycle.setTotalLearningDays(billingPeriod.getTotalLearningDays());
			newCycle.setStatus(BillingCycleStatus.IN_PROGRESS);
			newCycle.setType(BillingCycleType.CHARGE);
			newCycle.setCycleNum(newCycleNum);
			newCycle.setAmountDue(feeAmount.subtract(totalDiscount));
			newCycle.setAmountPaid(BigDecimal.ZERO);
			collectPayment(newCycle);
			BillingCycle createdCycle = billingCycleRepository.save(newCycle);
			
			enrollment.setNextBillingDate(billingPeriod.getNextCycleStartDate());
			enrollmentRepository.save(enrollment);

			dto = GenerateBillingResponseDTO.builder().id(createdCycle.getId())
					.enrollmentId(createdCycle.getId())
					.courseCode(course.getCode())
					.studentCode(student.getStudentCode())
					.name(student.getLastName() + " " + student.getFirstName())
					.amountDue(newCycle.getAmountDue())
					.amountPaid(newCycle.getAmountPaid())
					.generatedDate(createdCycle.getGeneratedDate())
					.cycleStartDate(createdCycle.getCycleStartDate())
					.cycleEndDate(createdCycle.getCycleEndDate())
					.dueDate(createdCycle.getDueDate())
					.nextCycleStartDate(enrollment.getNextBillingDate())
					.frequency(frequency)
					.totalLearningDays(createdCycle.getTotalLearningDays())
					.cycleNum(createdCycle.getCycleNum())
					.status(createdCycle.getStatus())
					.type(createdCycle.getType()).build();
			billingResponse.add(dto);
		}
		return billingResponse;
	}

	private BillingPeriod calculateBillingPeriodByFrequency(LocalDate cycleStartDate, LocalDate endEnrollDate,
			Frequency frequency, Set<DayOfWeek> learningDays) {
		LocalDate nextCycleStartDate;
		switch (frequency) {
		case MONTHLY:
			nextCycleStartDate = cycleStartDate.plusMonths(1);
			break;
		case QUARTERLY:
			nextCycleStartDate = cycleStartDate.plusMonths(3);
			break;
		case ANNUAL:
			nextCycleStartDate = cycleStartDate.plusYears(1);
			break;
		default:
			throw new IllegalArgumentException("Invalid billing duration: " + frequency);
		}
		if (nextCycleStartDate.isAfter(endEnrollDate)) {
			nextCycleStartDate = endEnrollDate;
		}
		LocalDate cycleEndDate = nextCycleStartDate.minusDays(1); // Bill up to the day before the next cycle starts.

		// Calculate total learning days within the cycle
		int totalLearningDays = 0;
		LocalDate currentDate = cycleStartDate;
		while (!currentDate.isAfter(cycleEndDate)) {
			if (learningDays.contains(currentDate.getDayOfWeek())) {
				totalLearningDays++;
			}
			currentDate = currentDate.plusDays(1);
		}

		return new BillingPeriod(cycleEndDate, nextCycleStartDate, totalLearningDays);
	}

	private BillingPeriod calculateBillingPeriodByLearningDays(LocalDate cycleStartDate, LocalDate endEnrollDate,
			Set<DayOfWeek> learningDays, Integer requiredLearningDays) {
		LocalDate currentDate = cycleStartDate;
		int learningDayCount = 0;

		// Count the number of valid learning days.
		while (learningDayCount < requiredLearningDays) {
			if (learningDays.contains(currentDate.getDayOfWeek())) {
				learningDayCount++;
			}
			currentDate = currentDate.plusDays(1);
		} //  loop finishes, currentDate has already been advanced by one day

		LocalDate cycleEndDate = currentDate.minusDays(1);
		if (cycleEndDate.isAfter(endEnrollDate)) {
		    cycleEndDate = endEnrollDate;
		    return new BillingPeriod(cycleEndDate, GlobalConstants.MAX_DATE, learningDayCount);
		}

		LocalDate nextCycleStartDate = cycleEndDate.plusDays(1);
		// Find the next valid learning day after the cycleEndDate
		while (!learningDays.contains(nextCycleStartDate.getDayOfWeek())) {
			nextCycleStartDate = nextCycleStartDate.plusDays(1);
		}

		return new BillingPeriod(cycleEndDate, nextCycleStartDate, learningDayCount);
	}

	/**
	 * Check for approved leave requests for this enrollment and create a FREE billing cycle
	 * that compensates the missed learning days. Advances enrollment.nextBillingDate by
	 * the number of learning days compensated.
	 *
	 * @return updated cycle number (incremented if a free cycle was created)
	 */
	    private GenerateBillingResponseDTO handleLeavesAndMaybeCreateFreeCycle(Enrollment enrollment, Course course, Student student, LocalDate cycleStartDate, LocalDate effDate) {
		List<LeaveRequest> leaves = leaveRequestRepository.getLeaveForBilling(
				enrollment.getStudent().getStudentCode(), enrollment.getStudent().getStudentCode(), effDate,
				LeaveStatus.APPROVED);

		if (leaves == null || leaves.isEmpty()) {
			return null;
		}

		List<LeaveRequest> filtered = leaves.stream()
				.filter(lr -> lr.getCourse() != null && lr.getCourse().getId() != null
						&& lr.getCourse().getId().equals(course.getId())
						&& !lr.getLeaveDate().isBefore(cycleStartDate) && !lr.getLeaveDate().isAfter(effDate))
				.collect(Collectors.toList());

		if (filtered.isEmpty()) {
			return null;
		}

		int leaveCount = filtered.size();

		BillingPeriod bp = calculateBillingPeriodByLearningDays(cycleStartDate, enrollment.getEndDate(),
				course.getDaysOfWeek(), leaveCount);

		BillingCycle freeCycle = new BillingCycle();
		freeCycle.setCourseCode(course.getCode());
		freeCycle.setStudentCode(enrollment.getStudent().getStudentCode());
		freeCycle.setEnrollmentId(enrollment.getId());
		freeCycle.setBillingFrequencyOption(enrollment.getBillingFrequencyOption());
		freeCycle.setGeneratedDate(effDate);
		freeCycle.setCycleStartDate(cycleStartDate);
		freeCycle.setCycleEndDate(bp.getCycleEndDate());
		freeCycle.setDueDate(bp.getCycleEndDate());
		freeCycle.setTotalLearningDays(bp.getTotalLearningDays());
		freeCycle.setStatus(BillingCycleStatus.COMPLETED);
		freeCycle.setType(BillingCycleType.CREDIT);
		freeCycle.setCycleNum(0);
		freeCycle.setAmountDue(BigDecimal.ZERO);
		freeCycle.setAmountPaid(BigDecimal.ZERO);

		BillingCycle createdFree = billingCycleRepository.save(freeCycle);

		// mark the leave requests as refunded and save them
		for (LeaveRequest lr : filtered) {
			lr.setStatus(LeaveStatus.REFUNDED);
			lr.setDecisionDate(effDate);
		}
		leaveRequestRepository.saveAll(filtered);

		enrollment.setNextBillingDate(bp.getNextCycleStartDate());
		enrollmentRepository.save(enrollment);

		GenerateBillingResponseDTO dto = GenerateBillingResponseDTO.builder().id(createdFree.getId())
				.enrollmentId(createdFree.getEnrollmentId())
				.courseCode(createdFree.getCourseCode())
				.studentCode(createdFree.getStudentCode())
				.name(student.getLastName() + " " + student.getFirstName())
				.amountDue(createdFree.getAmountDue())
				.amountPaid(createdFree.getAmountPaid())
				.generatedDate(createdFree.getGeneratedDate())
				.cycleStartDate(createdFree.getCycleStartDate())
				.cycleEndDate(createdFree.getCycleEndDate())
				.nextCycleStartDate(enrollment.getNextBillingDate())
				.dueDate(createdFree.getDueDate())
				.frequency(null)
				.totalLearningDays(createdFree.getTotalLearningDays())
				.cycleNum(createdFree.getCycleNum())
				.status(createdFree.getStatus())
				.type(createdFree.getType()).build();
		

		return dto;
	}

	@Transactional
	public List<CollectionResponseDTO> processCollections(CollectionRequestDTO request) {
		List<CollectionResponseDTO> collectionResponse = new ArrayList<>();
		effDate = request.getEffDate() != null ? request.getEffDate() : LocalDate.now();
		fromStudentCode = request.getFromStudentCode() != "" ? request.getFromStudentCode() : "st00000";
		toStudentCode = request.getToStudentCode() != "" ? request.getFromStudentCode() : "st99999";
		
		List<BillingCycle> billingCycles = billingCycleRepository.findAllByStatusAndStudentCodeRangeAndGeneratedDate(
			BillingCycleStatus.IN_PROGRESS, fromStudentCode, toStudentCode, effDate);
		
		for (BillingCycle billingCycle : billingCycles) {
			CollectionResponseDTO collection = collectPayment(billingCycle);
			if (collection != null) {
				billingCycleRepository.save(billingCycle);
				collectionResponse.add(collection);
			}
		}
		
		return collectionResponse;
	}

	private CollectionResponseDTO collectPayment(BillingCycle billingCycle) {
		StudentAccount studentAccount = studentAccountService.findByStudentCode(billingCycle.getStudentCode());
		BigDecimal remaining = billingCycle.getAmountDue().min(billingCycle.getAmountPaid());
		BigDecimal amountToPay = remaining.min(studentAccount.getBalanceAmount());

		if (amountToPay.compareTo(BigDecimal.ZERO) != 0) {
			billingCycle.setAmountPaid(billingCycle.getAmountPaid().add(amountToPay));
			if (billingCycle.getAmountDue().compareTo(billingCycle.getAmountPaid()) == 0) {
				billingCycle.setStatus(BillingCycleStatus.COMPLETED);
			} else if (billingCycle.getDueDate().isBefore(effDate)) {
				billingCycle.setStatus(BillingCycleStatus.OVERDUE);
			}

			updateStudentAccount(studentAccount, amountToPay);
			Payment payment = createPayment(billingCycle, studentAccount, amountToPay);

			CollectionResponseDTO collection = new CollectionResponseDTO();
			collection.setPayments(new ArrayList<>());
			collection.setCourseCode(billingCycle.getCourseCode());
			collection.setStudentCode(billingCycle.getStudentCode());
			collection.setCycleStartDate(billingCycle.getCycleStartDate());
			collection.setCycleEndDate(billingCycle.getCycleEndDate());
			collection.setCycleNum(billingCycle.getCycleNum());
			collection.getPayments().add(payment);
			return collection;
		}
		return null;
	}

	private void updateStudentAccount(StudentAccount studentAccount, BigDecimal amountToPay) {
		studentAccount.setBalanceAmount(studentAccount.getBalanceAmount().subtract(amountToPay));
		studentAccountService.save(studentAccount);
	}

	private Payment createPayment(BillingCycle billingCycle, StudentAccount studentAccount, BigDecimal amountToPay) {
		Payment payment = new Payment();
		payment.setBillingCycle(billingCycle);
		payment.setStudentAccount(studentAccount);
		payment.setPaymentDate(LocalDate.now());
		payment.setAmount(amountToPay);

		return paymentRepository.save(payment);
	}
	
	public Page<BillingCycle> getFilteredBillingCycles(BillingCycleStatus status, String StudentCode, Long enrollmentId,
			Integer cycleNum, LocalDate startDate, LocalDate endDate, int page, int size) {
		Specification<BillingCycle> spec = Specification.where(BillingCycleSpecification.hasStatus(status))
				.and(BillingCycleSpecification.hasStudentCode(StudentCode))
				.and(BillingCycleSpecification.hasEnrollmentId(enrollmentId))
				.and(BillingCycleSpecification.hasCycleNum(cycleNum))
				.and(BillingCycleSpecification.hasCycleStartDateBetween(startDate, endDate));

		return billingCycleRepository.findAll(spec, PageRequest.of(page, size));
	}

	@Getter
	@Setter
	@AllArgsConstructor
	private static class BillingPeriod {
		private final LocalDate cycleEndDate;
		private final LocalDate nextCycleStartDate;
		private final Integer totalLearningDays;
	}

}
