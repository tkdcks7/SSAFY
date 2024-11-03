package com.palja.audisay.domain.recommendation.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.ToString;

@Document(collection = "demographics")
@Getter
@ToString
public class DemographicsBook {

	@Id
	private String id;
	private String groupId;
	private List<Integer> bookList;
}
