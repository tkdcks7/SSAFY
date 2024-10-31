package com.palja.audisay.domain.note.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.note.entity.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
	@Query("SELECT n FROM Note n JOIN FETCH n.book WHERE n.member.memberId = :memberId ORDER BY n.createdAt")
	List<Note> findAllByMemberIdWithBook(@Param("memberId") Long memberId);

	List<Note> findAllByMemberMemberIdAndBookBookIdOrderByCreatedAt(Long memberId, Long bookId);

	void deleteByNoteIdAndMemberMemberId(Long noteId, Long memberId);
}
