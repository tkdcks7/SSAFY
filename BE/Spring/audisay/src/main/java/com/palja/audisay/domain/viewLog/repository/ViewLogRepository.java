package com.palja.audisay.domain.viewLog.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.viewLog.entity.ViewLog;
import com.palja.audisay.global.annotation.MongoDBRepository;

@Repository
@MongoDBRepository
public interface ViewLogRepository extends
	MongoRepository<ViewLog, String> {

	@Query(value = "{ 'memberId': ?0 }", sort = "{ 'createdAt': -1 }")
	Page<ViewLog> findLatestLogByMemberId(Long memberId, Pageable pageable);
}
