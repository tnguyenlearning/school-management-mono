package com.school.mgmt.billing.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.mgmt.billing.entity.StudentAccount;
import com.school.utilslibrary.constant.StudentAccountType;

@RepositoryRestResource(path = "student-accounts")
public interface StudentAccountRepository extends JpaRepository<StudentAccount, Long> {

	@Query("SELECT s FROM StudentAccount s WHERE " + 
			"(:studentCode IS NULL OR s.studentCode LIKE %:studentCode%) AND " + 
			"(:type IS NULL OR s.type = :type) AND " +
			"(:studentCodes IS NULL OR s.studentCode IN :studentCodes)")
	Page<List<StudentAccount>> findStudentAccounts(
			@Param("studentCodes") List<String> studentCodes,
			@Param("studentCode") String studentCode,
			@Param("type") StudentAccountType type, 
			Pageable pageable);

	Optional<StudentAccount> findByStudentCode(String studentCode);

}
