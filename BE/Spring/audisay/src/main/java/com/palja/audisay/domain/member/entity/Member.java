package com.palja.audisay.domain.member.entity;

import java.time.LocalDate;

import org.hibernate.annotations.DynamicInsert;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder
@DynamicInsert
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "long", nullable = false)
	private Long memberId;

	@Column(columnDefinition = "varchar(320)", nullable = false, unique = true)
	private String email;

	@Column(columnDefinition = "varchar(255)", nullable = false)
	private String password;

	@Column(columnDefinition = "varchar(18)", nullable = false)
	private String name;

	@Column(columnDefinition = "varchar(15)", nullable = false)
	private String nickname;

	@Column(columnDefinition = "date", nullable = false)
	private LocalDate birth;

	@Column(columnDefinition = "enum('M', 'F')", nullable = false)
	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(columnDefinition = "tinyint(1)", nullable = false)
	private boolean blindFlag;

	@Column(columnDefinition = "tinyint(1) default 0", nullable = false)
	private boolean deleteFlag;
}
