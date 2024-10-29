package com.palja.audisay.domain.s3.service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.palja.audisay.domain.s3.dto.S3ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
	private final AmazonS3 amazonS3;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	public S3ResponseDto getPresignedUrlToUpload(String fileName) {
		/// 제한시간 설정
		Date expiration = new Date();
		long expTime = expiration.getTime();
		expTime += TimeUnit.MINUTES.toMillis(3); // 3 Minute
		expiration.setTime(expTime);

		GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, fileName)
			.withMethod(HttpMethod.PUT)
			.withExpiration(expiration);

		return S3ResponseDto.builder()
			.url(amazonS3.generatePresignedUrl(generatePresignedUrlRequest).toString())
			.build();

	}

	public S3ResponseDto getPresignedUrlToDownload(String fileName) {
		/// 제한시간 설정
		Date expiration = new Date();
		long expTime = expiration.getTime();
		expTime += TimeUnit.MINUTES.toMillis(3);
		expiration.setTime(expTime); // 3 Minute

		GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, fileName)
			.withMethod(HttpMethod.GET)
			.withExpiration(expiration);
		System.out.println("bucket+fileName = " + bucket+fileName);

		System.out.println("amazonS3.generatePresignedUrl(generatePresignedUrlRequest).toString() = " + amazonS3.generatePresignedUrl(generatePresignedUrlRequest).toString());
		return S3ResponseDto.builder()
			.url(amazonS3.generatePresignedUrl(generatePresignedUrlRequest).toString())
			.build();
	}

}