package com.palja.audisay.domain.member.repository;

import com.palja.audisay.domain.member.dto.MemberBookAnalysisResponseDto;
import com.palja.audisay.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

	boolean existsByEmail(String email);

	Optional<Member> findByEmail(String email);

	Optional<Member> findByMemberId(Long memberId);

	@Query("""
		SELECT new com.palja.audisay.domain.member.dto.MemberBookAnalysisResponseDto(
		    m.nickname,
		    COUNT(DISTINCT c.book.bookId),
		    COUNT(DISTINCT l.book.bookId)
		)
		FROM Member m
		LEFT JOIN BookCart c ON c.member.memberId = m.memberId
		LEFT JOIN Likes l ON l.member.memberId = m.memberId
		WHERE m.memberId = :memberId
			GROUP BY m.memberId
		""")
	MemberBookAnalysisResponseDto getBookAnalysisByMemberId(@Param("memberId") Long memberId);

}
