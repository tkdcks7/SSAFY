package com.palja.audisay.domain.recommendation.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.ToString;

@Document(collection = "famous")
@Getter
@ToString
public class FamousBook {

	@Id
	private String id;
	private String groupId;
	private List<Integer> bookList;
}
