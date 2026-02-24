package com.school.mgmt.util.autonum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.school.mgmt.util.autonum.entity.AnumTracker;
import com.school.utilslibrary.constant.AnumType;

@Repository
public interface AnumTrackerRepository extends JpaRepository<AnumTracker, Long> {

	@Query("SELECT a.currentSequence FROM AnumTracker a WHERE a.type = :type")
	Integer findCurrentSequenceByType(@Param("type") AnumType type);

	@Modifying
	@Query("UPDATE AnumTracker a SET a.currentSequence = :currentSequence WHERE a.type = :type")
	void updateCurrentSequence(@Param("type") AnumType type, @Param("currentSequence") Integer currentSequence);

	@Modifying
	@Query("INSERT INTO AnumTracker (type, currentSequence) VALUES (:type, :currentSequence)")
	void insertCurrentSequence(@Param("type") AnumType type, @Param("currentSequence") Integer currentSequence);

}
