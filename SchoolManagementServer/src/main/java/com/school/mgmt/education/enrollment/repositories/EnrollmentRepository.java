package com.school.mgmt.education.enrollment.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.mgmt.education.enrollment.dto.StudentEnrollmentDTO;
import com.school.mgmt.education.enrollment.entities.Enrollment;
import com.school.mgmt.education.enrollment.entities.Student;

@RepositoryRestResource(path = "enrollments")
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
	
	@Query("SELECT e FROM Enrollment e "
			+ "WHERE e.student.studentCode BETWEEN :fromStudentCode AND :toStudentCode " 
			+ "AND :effDate >= e.nextBillingDate")
	List<Enrollment> getFilteredForBilling(String fromStudentCode, String toStudentCode, LocalDate effDate);

	@Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId")
	List<Enrollment> findAllByCourseId(Long courseId);

	@Query("SELECT e.id FROM Enrollment e WHERE e.course.id = :courseId")
	List<Long> findIdsByCourseId(Long courseId);
	
	@Query("SELECT e FROM Enrollment e WHERE e.id IN :enrollmentIds")
	List<Enrollment> findAllByEnrollmentIds(@Param("enrollmentIds") List<Long> enrollmentIds);

	@Query("SELECT new com.school.mgmt.education.enrollment.dto.StudentEnrollmentDTO("
			+ "s.id, s.studentCode, s.firstName, s.lastName, s.gender, s.age, s.phoneNumber, s.email, s.address, "
			+ "e.id, e.enrollmentDate, e.startDate, e.endDate, e.status) "
			+ "FROM Student s " + "LEFT JOIN Enrollment e ON s.id = e.student.id "
			+ "WHERE e.course.id = :courseId")
	List<StudentEnrollmentDTO> findStudentsAndEnrollmentByCourseId(@Param("courseId") Long courseId);
	
	@Query("SELECT s FROM Student s WHERE s.studentCode LIKE %:studentCode% "
			+ "AND s.id NOT IN (SELECT e.student.id FROM Enrollment e WHERE e.course.id = :courseId)")
	List<Student> findStudentsByStudentCodeNotEnrolled(Long courseId, String studentCode);

	@Query("SELECT s FROM Student s WHERE s.phoneNumber LIKE %:phoneNumber% "
			+ "AND s.id NOT IN (SELECT e.student.id FROM Enrollment e WHERE e.course.id = :courseId)")
	List<Student> findStudentsByPhoneNotEnrolled(Long courseId, String phoneNumber);

	@Query("SELECT s FROM Student s WHERE s.firstName LIKE %:firstName% "
			+ "AND s.id NOT IN (SELECT e.student.id FROM Enrollment e WHERE e.course.id = :courseId)")
	List<Student> findStudentsByFirstNameNotEnrolled(Long courseId, String firstName);
	
	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("""
			    UPDATE Enrollment e
			    SET e.nextBillingDate = :nextBillingDate
			    WHERE e.course.id IN :courseId
			      AND (e.nextBillingDate < :nextBillingDate)
			""")
	int updateNextBillingDateIfEarlier(@Param("courseId") Long courseId,
			@Param("nextBillingDate") LocalDate nextBillingDate);

	//
//	@Query("SELECT e.student FROM Enrollment e WHERE e.course.id = :courseId")
//	List<Student> findStudentsByCourseId(String courseId);
//
//	@Query("SELECT e.course FROM Enrollment e WHERE e.student.id = :studentId")
//	List<Course> findCoursesByStudentId(String studentId);
//
//	@Modifying
//	@Transactional
//	@Query("DELETE FROM Enrollment e WHERE e.course.id = :courseId AND e.student.id = :studentId")
//	int deleteByCourseIdAndStudentId(String courseId, String studentId);
//
//	Optional<Enrollment> findByCourseIdAndStudentId(String courseId, String studentId);
//
//	@Query("SELECT e FROM Enrollment e "
//			+ "WHERE e.validflag=1 AND e.student.id BETWEEN :fromStudentId AND :toStudentId "
//			+ "AND e.status = :status " + "AND :effDate >= e.nextGenerateBillingDate")
//	List<Enrollment> findByStudentIdRangeDueToGenerateBilling(@Param("fromStudentId") String fromStudentId,
//			@Param("toStudentId") String toStudentId, @Param("status") EnrollmentStatus status,
//			@Param("effDate") LocalDate effDate);

}
