package com.palja.audisay.domain.viewLog.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.viewLog.entity.ViewLog;
import com.palja.audisay.domain.viewLog.repository.ViewLogRepository;
import com.palja.audisay.global.util.StringUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ViewLogService {
	private final ViewLogRepository viewLogRepository;

	public void saveBookViewLog(Long memberId, Book book) {
		ViewLog viewLog = ViewLog.builder()
			.memberId(memberId)
			.bookId(book.getBookId())
			.title(book.getTitle())
			// 지정한 양식을 사용하기 위해, @CreatedDate 사용 안 함
			.createdAt(StringUtil.datetimeToString(LocalDateTime.now()))
			.categoryId(book.getCategory().getCategoryId())
			.build();
		viewLogRepository.save(viewLog);
	}

}
