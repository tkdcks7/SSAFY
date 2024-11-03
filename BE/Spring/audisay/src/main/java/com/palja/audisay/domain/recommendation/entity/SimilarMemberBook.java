package com.palja.audisay.domain.recommendation.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.ToString;

@Document(collection = "similarMember")
@Getter
@ToString
public class SimilarMemberBook {

	@Id
	private String id;
	private String memberId;
	private List<Integer> bookList;
}
