package com.palja.audisay.domain.recommendation.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.FamousBook;

@Repository
public interface FamouseBookRepository extends
	MongoRepository<FamousBook, String> {

	FamousBook findByGroupId(String groupId);
}
