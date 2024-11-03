package com.palja.audisay.domain.recommendation.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.ToString;

@Document(collection = "rec_category")
@Getter
@ToString
public class CategoryBook {

	@Id
	private String id;
	private String groupId;
	private List<Integer> bookList;
}
