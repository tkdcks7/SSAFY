package com.palja.audisay.domain.recommendation.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.SimilarMemberBook;

@Repository
public interface SimilarMemberBookRepository extends
	MongoRepository<SimilarMemberBook, String> {

	Optional<SimilarMemberBook> findByMemberId(Long memberId);
}
