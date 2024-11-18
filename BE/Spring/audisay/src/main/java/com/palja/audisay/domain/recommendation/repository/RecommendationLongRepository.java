package com.palja.audisay.domain.recommendation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.RecommendationLong;
import com.palja.audisay.global.annotation.MongoDBRepository;

@Repository
@MongoDBRepository
public interface RecommendationLongRepository extends
	MongoRepository<RecommendationLong, Long> {

	Optional<RecommendationLong> findByTargetId(Long targetId);

	Optional<RecommendationLong> findByrTypeAndTargetId(String rType, Long targetId);

	// famous
	@Query(value = "{ 'r_type': 'famous' }", sort = "{ 'target_id' : -1 }")
	List<RecommendationLong> findFamousFirstOrderByGroupIdDesc();
}
