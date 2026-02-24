package com.school.mgmt.education.enrollment.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import com.school.mgmt.education.enrollment.entities.Student;

@RepositoryRestResource(path = "students")
public interface StudentRepository extends JpaRepository<Student, Long> {
	
	public Boolean existsByStudentCode(String studentCode);

	public Student findByStudentCode(String studentCode);

	public Page<Student> findByPhoneNumberContaining(String phone, Pageable p);

	public Page<Student> findByStudentCodeContaining(String studentCode, Pageable p);

	public Page<Student> findByFirstNameContaining(String firstName, Pageable p);

	@RestResource(path = "findStudentCodeContaining")
	@Query("SELECT s.studentCode FROM Student s WHERE " +
	       "(:phone IS NULL OR s.phoneNumber LIKE %:phone%) AND " +
	       "(:studentCode IS NULL OR s.studentCode LIKE %:studentCode%) AND " +
	       "(:firstName IS NULL OR s.firstName LIKE %:firstName%)")
	List<String> findStudentCodeContaining(
	        String phone,
	        String studentCode,
	        String firstName);
}
