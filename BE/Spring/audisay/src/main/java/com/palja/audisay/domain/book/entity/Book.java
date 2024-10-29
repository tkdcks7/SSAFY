package com.palja.audisay.domain.book.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.palja.audisay.domain.category.entity.Category;
import com.palja.audisay.domain.member.entity.Member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder
@DynamicInsert
public class Book {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "long", nullable = false)
	private Long bookId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@Column(columnDefinition = "text", nullable = false)
	private String title;

	@Column(columnDefinition = "text", nullable = false)
	private String cover;

	@Column(columnDefinition = "text", nullable = false)
	private String coverAlt;

	@Column(columnDefinition = "varchar(50)", nullable = false)
	private String author;

	@Column(columnDefinition = "varchar(50)")
	private String publisher;

	@Column(columnDefinition = "date")
	private LocalDate publishedDate;

	@Column(columnDefinition = "text")
	private String story;

	@Column(columnDefinition = "varchar(15)")
	private String isbn;

	@Column(columnDefinition = "varchar(50)", nullable = false)
	private Boolean myTtsFlag;

	@Column(columnDefinition = "text", nullable = false)
	private String epub;

	@Column(columnDefinition = "enum('PUBLISHED, REGISTERED')", nullable = false)
	@Enumerated(EnumType.STRING)
	private Dtype dtype;

	@Column(columnDefinition = "datetime default current_timestamp", nullable = false)
	@CreationTimestamp
	private LocalDateTime createdAt;
}
