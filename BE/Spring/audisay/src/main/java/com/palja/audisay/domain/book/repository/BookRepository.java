package com.palja.audisay.domain.book.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.book.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
}
