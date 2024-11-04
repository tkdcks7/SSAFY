package com.palja.audisay.domain.recommendation.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.CategoryBook;

@Repository
public interface CategoryBookRepository extends
	MongoRepository<CategoryBook, String> {

	Optional<CategoryBook> findByGroupId(String groupId);
}
