package com.palja.audisay.domain.recommendation.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.DemographicsBook;

@Repository
public interface DemographicsBookRepository extends
	MongoRepository<DemographicsBook, String> {

	DemographicsBook findByGroupId(String groupId);
}
