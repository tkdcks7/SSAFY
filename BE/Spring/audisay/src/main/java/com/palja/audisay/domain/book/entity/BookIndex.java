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
	@Field(name = "book_id", type = FieldType.Long)
	private Long bookId;

	@Field(name = "author", type = FieldType.Text, analyzer = "korean_index", searchAnalyzer = "korean_search")
	private String author;

	@MultiField(mainField = @Field(name = "category", type = FieldType.Text), otherFields = {
		@InnerField(suffix = "keyword", type = FieldType.Keyword, ignoreAbove = 256)
	})
	private String category;

	@MultiField(mainField = @Field(name = "cover", type = FieldType.Text), otherFields = {
		@InnerField(suffix = "keyword", type = FieldType.Keyword, ignoreAbove = 256)
	})
	private String cover;

	@MultiField(mainField = @Field(name = "cover_alt", type = FieldType.Text), otherFields = {
		@InnerField(suffix = "keyword", type = FieldType.Keyword, ignoreAbove = 256)
	})
	private String coverAlt;

	@MultiField(mainField = @Field(name = "d_type", type = FieldType.Text), otherFields = {
		@InnerField(suffix = "keyword", type = FieldType.Keyword, ignoreAbove = 256)
	})
	private String dType;

	@Field(name = "last_updated", type = FieldType.Date)
	private LocalDate lastUpdated;

	@Field(name = "published_date", type = FieldType.Date)
	private LocalDate publishedDate;

	@Field(name = "publisher", type = FieldType.Text, analyzer = "korean_index", searchAnalyzer = "korean_search")
	private String publisher;

	@Field(name = "review", type = FieldType.Float)
	private Float review;

	@Field(name = "title", type = FieldType.Text, analyzer = "korean_index", searchAnalyzer = "korean_search")
	private String title;
}

