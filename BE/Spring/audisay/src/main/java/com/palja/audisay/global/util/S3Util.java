package com.palja.audisay.global.util;

public class S3Util {
	public static String getS3EpubUrl(String name) {
		return String.format("epub%s", name);
	}
}
