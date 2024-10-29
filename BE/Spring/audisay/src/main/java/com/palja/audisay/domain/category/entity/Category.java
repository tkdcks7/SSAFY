package com.palja.audisay.domain.category.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "category")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString(exclude = "children")
@Getter
@Builder
@DynamicInsert
public class Category {
	@Id
	@Column(columnDefinition = "varchar(10)", nullable = false)
	private String categoryId;

	@Column(columnDefinition = "varchar(50)", nullable = false)
	private String categoryName;

	@Column(columnDefinition = "enum('MAJOR', 'MIDDLE', 'SMALL')", nullable = false)
	@Enumerated(EnumType.STRING)
	private Level level;

	// 자기참조
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	private Category parent;

	@Builder.Default
	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Category> children = new ArrayList<>();
}
