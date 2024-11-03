package com.palja.audisay.domain.recommendation.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.ToString;

@Document(collection = "rec_similarBook")
@Getter
@ToString
public class SimilarBook {

	@Id
	private String id;
	private Long bookId;
	private List<Integer> bookList;
}
