package com.palja.audisay.domain.recommendation.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.recommendation.entity.SimilarLikeBook;

@Repository
public interface SimilarLikeBookRepository extends
	MongoRepository<SimilarLikeBook, String> {

	Optional<SimilarLikeBook> findByBookId(Long bookId);
}
