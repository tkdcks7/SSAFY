package com.palja.audisay.domain.book.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.dto.response.PublishedBookDownloadInfoDto;
import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.repository.BookRepository;
import com.palja.audisay.domain.cart.service.BookCartService;
import com.palja.audisay.domain.s3.service.S3Service;
import com.palja.audisay.global.exception.exceptions.PublishedBookDownloadFailedException;
import com.palja.audisay.global.exception.exceptions.PublishedBookNotFoundException;
import com.palja.audisay.global.util.ImageUtil;
import com.palja.audisay.global.util.S3Util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookDownloadService {
	private final BookRepository bookRepository;
	private final S3Service s3Service;
	private final ImageUtil imageUtil;
	private final BookCartService bookCartService;

	public PublishedBookDownloadInfoDto downloadPublishedBook(Long memberId, long bookId) {
		// 1. 데이터 읽어오기 
		Book book = bookRepository.findByBookId(bookId)
			.orElseThrow(PublishedBookNotFoundException::new);
		PublishedBookDownloadInfoDto publishedBookDownloadInfoDto = PublishedBookDownloadInfoDto.toDto(book);

		// 2. 도서 담기
		bookCartService.modifyCartStatus(memberId, bookId, true);
		// 3. Dto 데이터 추가
		// (1) 이미지 주소
		String fullCoverUrl = imageUtil.getFullImageUrl(book.getCover());
		publishedBookDownloadInfoDto.setCover(fullCoverUrl);
		// (2) 다운로드 주소 (presigned-url, 5분) 
		String presignedUrl = s3Service.getPresignedUrlToDownload(S3Util.getS3EpubUrl(book.getEpub())).getUrl();
		if (presignedUrl == null) {
			throw new PublishedBookDownloadFailedException();
		}
		publishedBookDownloadInfoDto.setUrl(presignedUrl);
		return publishedBookDownloadInfoDto;
	}
}
