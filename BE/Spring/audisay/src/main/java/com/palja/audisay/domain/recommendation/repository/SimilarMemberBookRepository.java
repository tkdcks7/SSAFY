package com.palja.audisay.domain.recommendation.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.SimilarBook;

@Repository
public interface SimilarMemberBookRepository extends
	MongoRepository<SimilarBook, String> {

	SimilarBook findByMemberId(Long memberId);
}
