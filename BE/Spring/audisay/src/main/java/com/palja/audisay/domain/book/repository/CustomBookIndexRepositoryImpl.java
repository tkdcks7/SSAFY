package com.palja.audisay.domain.book.repository;

import java.util.Arrays;

import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;

import com.palja.audisay.domain.book.dto.SearchAfterValues;
import com.palja.audisay.domain.book.dto.SearchSort;
import com.palja.audisay.domain.book.dto.request.SearchPaginationReqDto;
import com.palja.audisay.domain.book.entity.BookIndex;
import com.palja.audisay.global.util.StringUtil;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomBookIndexRepositoryImpl implements CustomBookIndexRepository {
	private final ElasticsearchOperations elasticsearchOperations;

	public SearchHits<BookIndex> searchPublishedBooks(SearchPaginationReqDto searchPaginationReqDto) {
		NativeQueryBuilder queryBuilder = NativeQuery.builder();

		setSearchQuery(queryBuilder, searchPaginationReqDto.getKeyword());
		setPageSize(queryBuilder, searchPaginationReqDto.getPageSize());
		SearchSort userSort = createSortCondition(searchPaginationReqDto.getSortBy(),
			searchPaginationReqDto.getSortOrder());
		setSortConditions(queryBuilder, userSort);
		setSearchAfter(queryBuilder, searchPaginationReqDto.getLastSearchId(), userSort);

		return elasticsearchOperations.search(queryBuilder.build(), BookIndex.class);
	}

	private void setSearchQuery(NativeQueryBuilder queryBuilder, String keyword) {
		if (StringUtil.isEmpty(keyword)) {
			queryBuilder.withQuery(q -> q.matchAll(m -> m));
		} else {
			Query query = Query.of(q -> q
				.multiMatch(m -> m
					.query(keyword)
					.fields(Arrays.asList("title", "author", "publisher"))
				)
			);
			queryBuilder.withQuery(query)
				.withMinScore(7.899f); // 검색 최소 일치도
		}
	}

	private void setPageSize(NativeQueryBuilder queryBuilder, int pageSize) {
		queryBuilder.withMaxResults(pageSize);
	}

	private SearchSort createSortCondition(String sortBy, String sortOrder) {
		return SearchSort.setSort(sortBy, sortOrder);
	}

	private void setSortConditions(NativeQueryBuilder queryBuilder, SearchSort userSort) {
		queryBuilder.withSort(Sort.by(Sort.Direction.DESC, "_score"))
			.withSort(Sort.by(userSort.sortOrder(), userSort.sortBy()))
			.withSort(Sort.by(Sort.Direction.DESC, "bookId"));
	}

	private void setSearchAfter(NativeQueryBuilder queryBuilder, String lastSearchId, SearchSort userSort) {
		if (lastSearchId != null) {
			SearchAfterValues searchAfter = SearchAfterValues.parse(userSort.sortBy(), lastSearchId);
			queryBuilder.withSearchAfter(searchAfter.values());
		}
	}
}
