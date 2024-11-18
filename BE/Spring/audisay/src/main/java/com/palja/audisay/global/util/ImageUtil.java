package com.palja.audisay.global.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ImageUtil {
	@Value("${cloud.aws.s3.cover.prefix.url}")
	private String imagePrefix;

	public String getFullImageUrl(String imageUrl) {
		if (imageUrl == null || imageUrl.isBlank()) {
			return null;
		}
		return "%s%s".formatted(imagePrefix, imageUrl);
	}
}
