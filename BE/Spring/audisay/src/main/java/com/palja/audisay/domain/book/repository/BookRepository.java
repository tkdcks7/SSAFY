package com.palja.audisay.domain.book.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.book.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, CustomBookRepository {
	@EntityGraph(attributePaths = {"category", "member"})
	Optional<Book> findByBookId(Long bookId);

	@EntityGraph(attributePaths = {"category"})
	List<Book> findByBookIdIn(List<Long> bookIds);

}
