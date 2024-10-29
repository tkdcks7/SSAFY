package com.palja.audisay.domain.s3.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palja.audisay.domain.s3.dto.S3ResponseDto;
import com.palja.audisay.domain.s3.service.S3Service;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class S3Controller {

	private final S3Service awsS3Service;

	@GetMapping("/presigned/upload")
	public S3ResponseDto getPresignedUrlToUpload(@RequestParam(value = "filename") String fileName) throws IOException {
		return awsS3Service.getPresignedUrlToUpload(fileName);
	}

	@GetMapping("/presigned/download")
	public S3ResponseDto getPresignedUrlToDownload(@RequestParam(value = "filename") String fileName) throws IOException {
		return awsS3Service.getPresignedUrlToDownload(fileName);
	}
}