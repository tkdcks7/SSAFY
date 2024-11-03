package com.palja.audisay.domain.recommendation.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.SimilarBook;
import com.palja.audisay.domain.recommendation.entity.SimilarMemberBook;

@Repository
public interface SimilarMemberBookRepository extends
	MongoRepository<SimilarMemberBook, String> {

	SimilarBook findByMemberId(Long memberId);
}
