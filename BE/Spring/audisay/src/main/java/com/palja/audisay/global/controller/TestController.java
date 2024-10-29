package com.palja.audisay.global.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/test")
@Tag(name="테스트", description = "테스트 API")
public class TestController {
	@GetMapping()
	@Operation(summary = "Get 테스트", description = "작동되면 hello world가 반환되는 API")
	public String test() {
		return "Hello World";
	}
}
