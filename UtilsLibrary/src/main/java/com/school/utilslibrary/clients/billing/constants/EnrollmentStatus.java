package com.school.utilslibrary.clients.billing.constants;

import java.util.Set;

public enum EnrollmentStatus {
	ENROLLED,
	WAITLISTED,
	ACTIVE,
	IN_DEBT,
	SUSPENDED,
	ON_HOLD,
	COMPLETED,
	FAILED,
	DROPPED,
	WITHDRAWN,
	CANCELLED;
	
	public static final Set<EnrollmentStatus> ENROLLMENT_STATUS = Set.of(
			ENROLLED,
			WAITLISTED,
			ACTIVE,
			IN_DEBT,
			SUSPENDED,
			ON_HOLD,
			COMPLETED,
			FAILED,
			DROPPED,
			WITHDRAWN,
			CANCELLED
	   );
	
	public static final Set<EnrollmentStatus> noDuplicateStatuses = Set.of(
			ENROLLED,
			WAITLISTED,
			ACTIVE,
			IN_DEBT,
			SUSPENDED,
			ON_HOLD
			);

}
