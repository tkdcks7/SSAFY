package com.palja.audisay.domain.s3.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class S3ResponseDto {
	/* S3 Presigned URL 주소 */
	private String url;
}
