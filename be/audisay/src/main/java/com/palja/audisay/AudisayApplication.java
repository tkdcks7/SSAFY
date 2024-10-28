package com.palja.audisay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class AudisayApplication {
	public static void main(String[] args) {
		SpringApplication.run(AudisayApplication.class, args);
	}

}
