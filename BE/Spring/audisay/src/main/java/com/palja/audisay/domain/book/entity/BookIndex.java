package com.palja.audisay.domain.book.entity;

import java.time.LocalDate;

import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.InnerField;
import org.springframework.data.elasticsearch.annotations.MultiField;

import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Document(indexName = "books_index")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder
public class BookIndex {
	@Id
	@Field(type = FieldType.Long)
	private Long bookId;

	@Field(type = FieldType.Text, analyzer = "korean_index", searchAnalyzer = "korean_search")
	private String author;

	@MultiField(mainField = @Field(type = FieldType.Text), otherFields = {
		@InnerField(suffix = "keyword", type = FieldType.Keyword, ignoreAbove = 256)
	})
	private String category;

	@MultiField(mainField = @Field(type = FieldType.Text), otherFields = {
		@InnerField(suffix = "keyword", type = FieldType.Keyword, ignoreAbove = 256)
	})
	private String cover;

	@MultiField(mainField = @Field(type = FieldType.Text), otherFields = {
		@InnerField(suffix = "keyword", type = FieldType.Keyword, ignoreAbove = 256)
	})
	private String coverAlt;

	@MultiField(mainField = @Field(type = FieldType.Text), otherFields = {
		@InnerField(suffix = "keyword", type = FieldType.Keyword, ignoreAbove = 256)
	})
	private String dType;

	@Field(type = FieldType.Date)
	private LocalDate lastUpdated;

	@Field(type = FieldType.Date)
	private LocalDate publishedDate;

	@Field(type = FieldType.Text, analyzer = "korean_index", searchAnalyzer = "korean_search")
	private String publisher;

	@Field(type = FieldType.Float)
	private Float review;

	@Field(type = FieldType.Text, analyzer = "korean_index", searchAnalyzer = "korean_search")
	private String title;
}
