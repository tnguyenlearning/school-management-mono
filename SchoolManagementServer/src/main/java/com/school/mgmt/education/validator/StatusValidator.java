package com.school.mgmt.education.validator;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import com.school.mgmt.education.enrollment.entities.Enrollment;
import com.school.utilslibrary.clients.billing.constants.EnrollmentStatus;
import com.school.utilslibrary.clients.education.constants.CourseStatus;
import com.school.utilslibrary.exception.BadRequestException;

public class StatusValidator {
	
	 private static final Set<EnrollmentStatus> PLANNED_ALLOWED_STATUSES = EnumSet.of(
	            EnrollmentStatus.ENROLLED, EnrollmentStatus.WAITLISTED, EnrollmentStatus.IN_DEBT
	    );
	    private static final Set<EnrollmentStatus> ONGOING_ALLOWED_STATUSES = EnumSet.of(
	    		EnrollmentStatus.ENROLLED,EnrollmentStatus.ACTIVE, EnrollmentStatus.IN_DEBT, EnrollmentStatus.SUSPENDED,
	            EnrollmentStatus.DROPPED, EnrollmentStatus.WITHDRAWN
	    );
	    private static final Set<EnrollmentStatus> COMPLETED_ALLOWED_STATUSES = EnumSet.of(
	            EnrollmentStatus.COMPLETED, EnrollmentStatus.FAILED, EnrollmentStatus.IN_DEBT
	    );
	    private static final Set<EnrollmentStatus> CANCELED_ALLOWED_STATUSES = EnumSet.of(
	            EnrollmentStatus.CANCELLED
	    );
	    private static final Set<EnrollmentStatus> ON_HOLD_ALLOWED_STATUSES = EnumSet.of(
	            EnrollmentStatus.ON_HOLD, EnrollmentStatus.WAITLISTED, EnrollmentStatus.IN_DEBT, EnrollmentStatus.SUSPENDED
	    );

	public static void validateCourseStatusTransition(CourseStatus currentStatus, CourseStatus newStatus) {
		switch (currentStatus) {
	        case PLANNED -> {
	            if (newStatus != CourseStatus.ONGOING && newStatus != CourseStatus.CANCELED && newStatus != CourseStatus.ON_HOLD) {
	                throw new BadRequestException("Course in PLANNED status can only transition to ONGOING, CANCELED, or ON_HOLD.");
	            }
	        }
	        case ONGOING -> {
	            if (newStatus != CourseStatus.COMPLETED && newStatus != CourseStatus.CANCELED && newStatus != CourseStatus.ON_HOLD) {
	                throw new BadRequestException("Course in ONGOING status can only transition to COMPLETED, CANCELED, or ON_HOLD.");
	            }
	        }
	        case COMPLETED, CANCELED -> {
	            if (newStatus != CourseStatus.ONGOING && newStatus != CourseStatus.PLANNED) {
		            throw new BadRequestException("Course in " + currentStatus + " status can only transition to ONGOING or PLANNED.");
	            }
	        }
	        case ON_HOLD -> {
	            if (newStatus != CourseStatus.PLANNED && newStatus != CourseStatus.ONGOING && newStatus != CourseStatus.CANCELED) {
	                throw new BadRequestException("Course in ON_HOLD status can only transition to PLANNED, ONGOING, or CANCELED.");
	            }
	        }
			default -> throw new BadRequestException("Unknown course status: " + currentStatus);
	    }
	}

	public static void updateEnrollmentStatusesBasedOnCourseStatus(CourseStatus courseStatus, List<Enrollment> enrollments) {
		for (Enrollment enrollment : enrollments) {
			EnrollmentStatus currentStatus = enrollment.getStatus();
			switch (courseStatus) {
			case ONGOING:
				if (currentStatus == EnrollmentStatus.ON_HOLD) {
					enrollment.setStatus(EnrollmentStatus.ACTIVE);
				}
				break;
			case ON_HOLD:
				if (currentStatus == EnrollmentStatus.ACTIVE || currentStatus == EnrollmentStatus.IN_DEBT) {
					enrollment.setStatus(EnrollmentStatus.ON_HOLD);
				}
				break;
			case CANCELED:
				enrollment.setStatus(EnrollmentStatus.CANCELLED);
				break;
			case COMPLETED:
				if (currentStatus == EnrollmentStatus.ACTIVE || currentStatus == EnrollmentStatus.IN_DEBT
						|| currentStatus == EnrollmentStatus.ON_HOLD) {
					enrollment.setStatus(EnrollmentStatus.COMPLETED);
				}
				break;
			default:
				throw new BadRequestException("Unhandled course status: " + courseStatus);
			}
		}
	}

	public static void validateEnrollmentStatusTransition(CourseStatus courseStatus, EnrollmentStatus currentStatus, EnrollmentStatus newStatus) {
        Set<EnrollmentStatus> allowedStatuses = getAllowedEnrollmentStatuses(courseStatus);

        if (currentStatus != null && !allowedStatuses.contains(currentStatus)) {
            throw new BadRequestException("Current enrollment status " + currentStatus + " is not valid for course status " + courseStatus);
        }

        if (!allowedStatuses.contains(newStatus)) {
            throw new BadRequestException("Cannot transition enrollment status from " + currentStatus + " to " + newStatus + " for course status " + courseStatus);
        }

        if (currentStatus != null) {
            validateSpecificEnrollmentTransitions(courseStatus, currentStatus, newStatus);
        }
    }

    private static Set<EnrollmentStatus> getAllowedEnrollmentStatuses(CourseStatus courseStatus) {
        switch (courseStatus) {
            case PLANNED:
                return PLANNED_ALLOWED_STATUSES;
            case ONGOING:
                return ONGOING_ALLOWED_STATUSES;
            case COMPLETED:
                return COMPLETED_ALLOWED_STATUSES;
            case CANCELED:
                return CANCELED_ALLOWED_STATUSES;
            case ON_HOLD:
                return ON_HOLD_ALLOWED_STATUSES;
            default:
                throw new BadRequestException("Unknown course status: " + courseStatus);
        }
    }

    private static void validateSpecificEnrollmentTransitions(CourseStatus courseStatus, EnrollmentStatus currentStatus, EnrollmentStatus newStatus) {
        switch (currentStatus) {
            case ENROLLED:
                if (courseStatus == CourseStatus.PLANNED) {
                    if (newStatus == EnrollmentStatus.WAITLISTED || newStatus == EnrollmentStatus.ACTIVE ||
                        newStatus == EnrollmentStatus.IN_DEBT || newStatus == EnrollmentStatus.DROPPED ||
                        newStatus == EnrollmentStatus.WITHDRAWN) {
                        return;
                    }
                } else if (courseStatus == CourseStatus.ONGOING) {
                    if (newStatus == EnrollmentStatus.ACTIVE) {
                        return;
                    }
                }
                break;
            case WAITLISTED:
                if (newStatus == EnrollmentStatus.ENROLLED || newStatus == EnrollmentStatus.IN_DEBT ||
                    newStatus == EnrollmentStatus.DROPPED) {
                    return;
                }
                break;
            case ACTIVE:
                if (newStatus == EnrollmentStatus.COMPLETED || newStatus == EnrollmentStatus.FAILED ||
                    newStatus == EnrollmentStatus.DROPPED || newStatus == EnrollmentStatus.WITHDRAWN ||
                    newStatus == EnrollmentStatus.IN_DEBT || newStatus == EnrollmentStatus.SUSPENDED ||
                    newStatus == EnrollmentStatus.ON_HOLD) {
                    return;
                }
                break;
            case IN_DEBT:
                if (newStatus == EnrollmentStatus.ACTIVE || newStatus == EnrollmentStatus.SUSPENDED ||
                    newStatus == EnrollmentStatus.COMPLETED || newStatus == EnrollmentStatus.CANCELLED) {
                    return;
                }
                break;
            case SUSPENDED:
                if (newStatus == EnrollmentStatus.ACTIVE || newStatus == EnrollmentStatus.DROPPED ||
                    newStatus == EnrollmentStatus.ON_HOLD) {
                    return;
                }
                break;
            case ON_HOLD:
                if (newStatus == EnrollmentStatus.ACTIVE || newStatus == EnrollmentStatus.DROPPED ||
                    newStatus == EnrollmentStatus.WITHDRAWN || newStatus == EnrollmentStatus.SUSPENDED) {
                    return;
                }
                break;
            case COMPLETED:
            case FAILED:
            case DROPPED:
            case WITHDRAWN:
            case CANCELLED:
                throw new BadRequestException("Cannot transition from " + currentStatus);
            default:
                throw new BadRequestException("Unknown enrollment status: " + currentStatus);
        }
    }

}
