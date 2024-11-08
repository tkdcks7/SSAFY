package com.palja.audisay.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mapping.model.SnakeCaseFieldNamingStrategy;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

@Configuration
public class MongoDBConfig {

	@Bean
	public MongoTemplate mongoTemplate(MongoDatabaseFactory mongoDbFactory) {
		// DBRefResolver 설정
		DbRefResolver dbRefResolver = new DefaultDbRefResolver(mongoDbFactory);
		// MongoMappingContext에 SnakeCaseFieldNamingStrategy 설정
		MongoMappingContext mongoMappingContext = new MongoMappingContext();
		mongoMappingContext.setFieldNamingStrategy(new SnakeCaseFieldNamingStrategy());
		// MappingMongoConverter 생성 및 _class 필드 제외 설정
		MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, mongoMappingContext);
		converter.setTypeMapper(new DefaultMongoTypeMapper(null));
		return new MongoTemplate(mongoDbFactory, converter);
	}
}
