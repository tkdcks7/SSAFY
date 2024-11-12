package com.palja.audisay.domain.book.repository;

import java.util.List;
import java.util.Optional;

import com.palja.audisay.domain.book.dto.request.SearchPaginationReqDto;
import com.palja.audisay.domain.book.dto.response.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;

public interface CustomBookRepository {
	Optional<PublishedBookInfoDto> findBookDetailByBookIdAndMemberId(Long memberId, Long bookId);

	List<Book> searchBookList(SearchPaginationReqDto searchReqDto);
}
