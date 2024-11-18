package com.palja.audisay.domain.book.repository;

import org.springframework.data.elasticsearch.core.SearchHits;

import com.palja.audisay.domain.book.dto.request.SearchPaginationReqDto;
import com.palja.audisay.domain.book.entity.BookIndex;

public interface CustomBookIndexRepository {
	SearchHits<BookIndex> searchPublishedBooks(SearchPaginationReqDto searchPaginationReqDto);
}
