package com.studentmanagement.dto;

public record CourseResponse(
        Long id,
        String code,
        String title,
        String description) {
}
