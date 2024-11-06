package com.palja.audisay.domain.recommendation.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.RecommendationString;

@Repository
public interface RecommendationStringRepository extends
	MongoRepository<RecommendationString, String> {

	Optional<RecommendationString> findByTargetId(Long targetId);

	Optional<RecommendationString> findByrTypeAndTargetId(String rType, String targetId);
}
