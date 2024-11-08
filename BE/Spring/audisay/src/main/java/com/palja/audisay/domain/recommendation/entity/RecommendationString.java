package com.palja.audisay.domain.recommendation.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.ToString;

@Document(collection = "recommendations_string")
@Getter
@ToString
public class RecommendationString {

	@Id
	private String id;
	@Field("r_type")
	private String rType;
	@Field("target_id")
	private String targetId;
	@Field("book_list")
	private List<Long> bookList;
}
