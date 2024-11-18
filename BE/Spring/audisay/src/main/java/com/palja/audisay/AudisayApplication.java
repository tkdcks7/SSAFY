package com.palja.audisay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.palja.audisay.global.annotation.ElasticSearchRepository;
import com.palja.audisay.global.annotation.MongoDBRepository;

@SpringBootApplication
@EnableElasticsearchRepositories(includeFilters = @Filter(type = FilterType.ANNOTATION, classes = ElasticSearchRepository.class))
@EnableMongoRepositories(includeFilters = @Filter(type = FilterType.ANNOTATION, classes = MongoDBRepository.class))
@EnableJpaRepositories(excludeFilters = {
	@Filter(type = FilterType.ANNOTATION, classes = MongoDBRepository.class),
	@Filter(type = FilterType.ANNOTATION, classes = ElasticSearchRepository.class)
})
public class AudisayApplication {
	public static void main(String[] args) {
		SpringApplication.run(AudisayApplication.class, args);
	}

}
