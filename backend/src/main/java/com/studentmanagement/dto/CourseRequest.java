package com.studentmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CourseRequest(
        @NotBlank @Pattern(regexp = "[A-Za-z]{2,6}-?[0-9]{2,4}", message = "must look like CS-101") String code,
        @NotBlank @Size(max = 120) String title,
        @Size(max = 500) String description) {
}
