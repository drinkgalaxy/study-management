package com.study.studymanagement.global.converter;

import java.time.Duration;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class DurationAttributeConverter implements AttributeConverter<Duration, Long> {

	@Override
	public Long convertToDatabaseColumn(Duration attribute) {
		return attribute == null ? null : attribute.getSeconds();
	}

	@Override
	public Duration convertToEntityAttribute(Long dbData) {
		return dbData == null ? null : Duration.ofSeconds(dbData);
	}
}
