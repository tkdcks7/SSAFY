package com.palja.audisay.domain.book.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.request.PublishedBookDownloadInfoDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookDownloadService {

	public PublishedBookDownloadInfoDto downloadPublishedBook(long bookId) {
		return PublishedBookDownloadInfoDto.builder()
			.build();
	}
}
