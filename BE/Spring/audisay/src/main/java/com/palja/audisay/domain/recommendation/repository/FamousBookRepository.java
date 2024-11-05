package com.palja.audisay.domain.recommendation.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.FamousBook;

@Repository
public interface FamousBookRepository extends
	MongoRepository<FamousBook, String> {

	FamousBook findByGroupId(Long groupId);

	@Query(value = "{}", sort = "{ 'groupId' : -1 }")
	FamousBook findFirstByOrderByGroupIdDesc();
}
