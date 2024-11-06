package com.palja.audisay.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

@Configuration
public class MongoDBConfig {

	@Bean
	public MappingMongoConverter mappingMongoConverter(MongoDatabaseFactory mongoDatabaseFactory,
		MongoMappingContext mongoMappingContext) {
		// DBRefResolver 설정
		DbRefResolver dbRefResolver = new DefaultDbRefResolver(mongoDatabaseFactory);
		// MappingMongoConverter 객체 생성
		MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, mongoMappingContext);
		// TypeMapper 설정: null 처리 -> _class 필드를 저장하지 않도록 설정
		converter.setTypeMapper(new DefaultMongoTypeMapper(null));  // _class 필드 제외
		return converter;
	}
}
