package com.palja.audisay.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Value("${current_server_url}")
    private String currentServerUrl;

    @Value("${prod_server_url}")
    private String productionServerUrl;

    @Bean
    public OpenAPI openAPI() {
        // Security scheme 설정 추가
        SecurityScheme auth = new SecurityScheme()
                .type(SecurityScheme.Type.APIKEY)
                .in(SecurityScheme.In.COOKIE)
                .name("SESSION"); // 쿠키 이름을 SESSION으로 설정

        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("cookieAuth"); // swagger에서 사용할 인증 스키마 이름
        return new OpenAPI()
                .components(new Components().addSecuritySchemes("cookieAuth", auth)) // SecurityScheme 이름과 함께 추가
                .addSecurityItem(securityRequirement)
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