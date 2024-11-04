package com.palja.audisay.domain.recommendation.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.SimilarBook;

@Repository
public interface SimilarBookRepository extends
	MongoRepository<SimilarBook, String> {

	Optional<SimilarBook> findByBookId(Long bookId);
}
