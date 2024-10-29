package com.palja.audisay.global.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.s3.dto.S3ResponseDto;

@RestController
@RequestMapping("api/test")
public class TestController {
	@GetMapping()
	public String test() {
		return "Hello World";
	}
}
