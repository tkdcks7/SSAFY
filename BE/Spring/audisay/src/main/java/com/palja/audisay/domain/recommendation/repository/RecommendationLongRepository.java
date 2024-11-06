package com.palja.audisay.domain.recommendation.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.RecommendationLong;

@Repository
public interface RecommendationLongRepository extends
	MongoRepository<RecommendationLong, Long> {

	Optional<RecommendationLong> findByTargetId(Long targetId);

	Optional<RecommendationLong> findByrTypeAndTargetId(String rType, Long targetId);

	// famous
	@Query(value = "{ 'r_type': 'famous' }", sort = "{ 'target_id' : -1 }")
	RecommendationLong findFamousFirstOrderByGroupIdDesc();
}
