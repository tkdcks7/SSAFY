package com.palja.audisay.domain.like.entity;

import java.io.Serializable;
import java.util.Objects;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.member.entity.Member;

public class LikeId implements Serializable {
	private Book book;
	private Member member;

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		LikeId that = (LikeId)o;
		return Objects.equals(member, that.member) && Objects.equals(book, that.book);
	}

	@Override
	public int hashCode() {
		return Objects.hash(member, book);
	}
}
