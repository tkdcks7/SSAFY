package com.palja.audisay.domain.likes.entity;

import java.io.Serializable;
import java.util.Objects;

import com.palja.audisay.domain.book.entity.Book;
import com.palja.audisay.domain.member.entity.Member;

public class LikesId implements Serializable {
	private Book book;
	private Member member;

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		LikesId that = (LikesId)o;
		return Objects.equals(member, that.member) && Objects.equals(book, that.book);
	}

	@Override
	public int hashCode() {
		return Objects.hash(member, book);
	}
}
