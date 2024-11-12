package com.palja.audisay.domain.book.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.book.entity.BookIndex;
import com.palja.audisay.global.annotation.ElasticSearchRepository;

@Repository
@ElasticSearchRepository
public interface BookIndexRepository extends ElasticsearchRepository<BookIndex, Long>, CustomBookIndexRepository {
}
