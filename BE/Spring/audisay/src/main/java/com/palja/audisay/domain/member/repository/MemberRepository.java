package com.palja.audisay.domain.member.repository;

import com.palja.audisay.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {


}
