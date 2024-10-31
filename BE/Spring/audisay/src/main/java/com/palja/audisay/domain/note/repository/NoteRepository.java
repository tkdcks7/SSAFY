package com.palja.audisay.domain.note.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.palja.audisay.domain.note.entity.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
	List<Note> findAllByMemberMemberIdOrderByCreatedAt(Long memberId);

	List<Note> findAllByMemberMemberIdAndBookBookIdOrderByCreatedAt(Long memberId, Long bookId);

	void deleteByNoteIdAndMemberMemberId(Long noteId, Long memberId);
}
