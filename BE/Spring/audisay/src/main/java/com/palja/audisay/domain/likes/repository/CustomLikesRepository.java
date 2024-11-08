package com.palja.audisay.domain.likes.repository;

import java.util.List;

import com.palja.audisay.domain.book.dto.request.CursorPaginationReqDto;
import com.palja.audisay.domain.likes.dto.LikesJoinBookDto;

public interface CustomLikesRepository {
	List<LikesJoinBookDto> findLikedBooksByMemberId(Long memberId, CursorPaginationReqDto searchReqDto);
}
