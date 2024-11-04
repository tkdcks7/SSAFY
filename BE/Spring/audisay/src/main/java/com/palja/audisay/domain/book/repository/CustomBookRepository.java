package com.palja.audisay.domain.book.repository;

import java.util.List;
import java.util.Optional;

import com.palja.audisay.domain.book.dto.request.BookSearchReqDto;
import com.palja.audisay.domain.book.dto.respose.PublishedBookInfoDto;
import com.palja.audisay.domain.book.entity.Book;

public interface CustomBookRepository {
	Optional<PublishedBookInfoDto> findBookDetailByBookIdAndMemberId(Long memberId, Long bookId);

	List<Book> searchBookList(BookSearchReqDto searchReqDto);
}
