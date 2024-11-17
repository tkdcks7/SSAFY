package com.palja.audisay.global.config;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class DoubleSerializer extends JsonSerializer<Double> {

	@Override
	public void serialize(Double value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
		if (value != null && value % 1 == 0) {
			// 정수로 간주되어야 할 경우 (예: 1.0 -> 1)
			gen.writeNumber(value.intValue());
		} else {
			// 그 외의 경우
			gen.writeNumber(value);
		}
	}
}
