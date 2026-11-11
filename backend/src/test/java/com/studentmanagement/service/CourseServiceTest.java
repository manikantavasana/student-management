package com.studentmanagement.service;

import com.studentmanagement.domain.Course;
import com.studentmanagement.dto.CourseRequest;
import com.studentmanagement.exception.BusinessRuleException;
import com.studentmanagement.repository.CourseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Test
    void deleteRejectsCourseWithEnrollments() {
        Course course = new Course("CS-101", "Modern Java", null);
        when(courseRepository.findById(4L)).thenReturn(Optional.of(course));
        when(courseRepository.countStudentsByCourseId(4L)).thenReturn(2L);

        CourseService service = new CourseService(courseRepository);

        assertThatThrownBy(() -> service.delete(4L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("2 student(s)");
        verify(courseRepository, never()).delete(any());
    }

    @Test
    void createRejectsDuplicateCourseCode() {
        CourseRequest request = new CourseRequest("CS-101", "Modern Java", null);
        when(courseRepository.existsByCodeIgnoreCase("CS-101")).thenReturn(true);

        CourseService service = new CourseService(courseRepository);

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("code already exists");
    }
}
