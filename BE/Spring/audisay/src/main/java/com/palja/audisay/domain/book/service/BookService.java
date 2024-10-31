package com.palja.audisay.domain.book.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.book.repository.BookRepository;
import com.palja.audisay.global.exception.exceptions.PublishedBookNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookService {

	private final BookRepository bookRepository;

	public Book validateBook(Long bookId) {
		return bookRepository.findByBookId(bookId).orElseThrow(PublishedBookNotFoundException::new);
	}
}
