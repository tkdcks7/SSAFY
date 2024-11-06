package com.palja.audisay.domain.viewLog.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Document(collection = "log_bookView")
@Getter
@Builder
@ToString
public class ViewLog {
	@Id
	private String id;
	private Long memberId;
	private Long bookId;
	private String categoryId;
	private String title;
	private String createdAt;
}
