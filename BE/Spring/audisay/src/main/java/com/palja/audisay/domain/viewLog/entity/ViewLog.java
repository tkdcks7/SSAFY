package com.palja.audisay.domain.viewLog.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.ToString;

@Document(collection = "log_bookView")
@Getter
@ToString
public class ViewLog {

	@Id
	private String id;
	private Long memberId;
	private Long bookId;
	private String categoryId;
	private String createdAt;
	private String title;
}
