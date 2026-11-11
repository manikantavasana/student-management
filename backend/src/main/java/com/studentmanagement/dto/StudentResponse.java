package com.studentmanagement.dto;

import java.util.List;

public record StudentResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        List<CourseSummary> courses) {

    public record CourseSummary(Long id, String code, String title) {
    }
}
