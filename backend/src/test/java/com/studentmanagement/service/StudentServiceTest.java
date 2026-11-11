package com.studentmanagement.service;

import com.studentmanagement.domain.Course;
import com.studentmanagement.domain.Student;
import com.studentmanagement.dto.StudentRequest;
import com.studentmanagement.exception.BusinessRuleException;
import com.studentmanagement.repository.CourseRepository;
import com.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;
    @Mock
    private CourseRepository courseRepository;

    private StudentService studentService;

    @BeforeEach
    void setUp() {
        studentService = new StudentService(studentRepository, courseRepository);
    }

    @Test
    void createEnrollsStudentInRequestedCourses() {
        Course java = new Course("CS-101", "Modern Java", null);
        StudentRequest request = new StudentRequest("Maya", "Shah", "MAYA@example.edu", Set.of(1L));
        when(studentRepository.existsByEmailIgnoreCase(request.email())).thenReturn(false);
        when(courseRepository.findAllById(request.courseIds())).thenReturn(List.of(java));
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = studentService.create(request);

        assertThat(response.email()).isEqualTo("maya@example.edu");
        assertThat(response.courses()).hasSize(1);
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void createRejectsDuplicateEmail() {
        StudentRequest request = new StudentRequest("Maya", "Shah", "maya@example.edu", Set.of());
        when(studentRepository.existsByEmailIgnoreCase(request.email())).thenReturn(true);

        assertThatThrownBy(() -> studentService.create(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("email already exists");
    }

    @Test
    void createRejectsUnknownCourse() {
        StudentRequest request = new StudentRequest("Maya", "Shah", "maya@example.edu", Set.of(99L));
        when(studentRepository.existsByEmailIgnoreCase(request.email())).thenReturn(false);
        when(courseRepository.findAllById(request.courseIds())).thenReturn(List.of());

        assertThatThrownBy(() -> studentService.create(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("selected courses");
    }
}
