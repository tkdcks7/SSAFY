package com.palja.audisay.domain.book.repository;

import java.util.Optional;

import com.palja.audisay.domain.book.dto.PublishedBookInfoDto;

public interface CustomBookRepository {
	Optional<PublishedBookInfoDto> findBookDetailByBookIdAndMemberId(Long memberId, Long bookId);
}
