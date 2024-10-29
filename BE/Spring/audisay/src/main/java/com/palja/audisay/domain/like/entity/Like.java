package com.palja.audisay.domain.like.entity;

import org.hibernate.annotations.DynamicInsert;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.cart.entity.BookCartId;
import com.palja.audisay.domain.member.entity.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "like")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@IdClass(LikeId.class)
@DynamicInsert
@Builder
public class Like {
	@Id
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "book_id", nullable = false)
	private Book book;

	@Id
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;
}
