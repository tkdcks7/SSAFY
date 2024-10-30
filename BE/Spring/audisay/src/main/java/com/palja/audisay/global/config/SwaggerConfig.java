package com.palja.audisay.global.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
>>>>>>>Stashed changes

@Configuration
public class SwaggerConfig {
    @Value("${current_server_url}")
    private String currentServerUrl;

    @Value("${prod_server_url}")
    private String productionServerUrl;

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components())
            .info(apiInfo())
            .servers(servers());
    }

    private Info apiInfo() {
        return new Info()
                .title("Audisay") // API의 제목
                .description("Audisay의 Swagger 문서입니다") // API에 대한 설명
                .version("1.0.0"); // API의 버전
    }

    public List<Server> servers() {
        return List.of(
            new Server().url(currentServerUrl).description("현재 서버"),
            new Server().url(productionServerUrl).description("배포 서버")
        );
    }
}