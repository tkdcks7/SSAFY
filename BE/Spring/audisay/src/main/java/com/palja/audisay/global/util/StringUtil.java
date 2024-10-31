package com.palja.audisay.global.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import com.palja.audisay.global.exception.exceptions.InvalidDatetimeException;

public class StringUtil {
	public static boolean isEmpty(String str) {
		return str == null || str.trim().isEmpty();
	}

	public static String datetimeToString(LocalDateTime date) {
		if (date == null) {
			throw new InvalidDatetimeException();
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		String formattedDateTime = date.format(formatter);
		return formattedDateTime;
	}

	public static LocalDateTime stringToDatetime(String date) {
		if (date == null) {
			throw new InvalidDatetimeException();
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

		LocalDateTime localDateTime = null;

		try {
			LocalDate localDate = LocalDate.parse(date, formatter);
			localDateTime = localDate.atStartOfDay(); // 자정으로 설정
		} catch (DateTimeParseException e) {
			try {
				localDateTime = LocalDateTime.parse(date, dateTimeFormatter);
			} catch (DateTimeParseException ex) {
				throw new InvalidDatetimeException();
			}
		}

		return localDateTime;
	}

	public static String dateToString(LocalDate date) {
		if (date == null) {
			throw new InvalidDatetimeException();
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		String formattedDateTime = date.format(formatter);
		return formattedDateTime;
	}

	public static LocalDate stringToDate(String date) {
		if (date == null) {
			throw new InvalidDatetimeException();
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate localDate = null;

		try {
			localDate = LocalDate.parse(date, formatter);
		} catch (DateTimeParseException e) {
			throw new InvalidDatetimeException();
		}

		return localDate;
	}

}
