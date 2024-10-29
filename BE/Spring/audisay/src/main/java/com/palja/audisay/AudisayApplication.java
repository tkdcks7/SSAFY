package com.palja.audisay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class AudisayApplication {
	public static void main(String[] args) {
		SpringApplication.run(AudisayApplication.class, args);
	}

}
