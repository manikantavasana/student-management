package com.studentmanagement.integration;

import com.studentmanagement.domain.Course;
import com.studentmanagement.domain.Student;
import com.studentmanagement.dto.StudentResponse;
import com.studentmanagement.repository.CourseRepository;
import com.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class StudentManagementIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @BeforeEach
    void clearDatabase() {
        studentRepository.deleteAll();
        courseRepository.deleteAll();
    }

    @Test
    void returnsStudentsAndCoursesThroughTheRestApi() {
        Course java = courseRepository.save(new Course("CS-101", "Modern Java", null));
        Student student = new Student("Aisha", "Patel", "aisha@example.edu");
        student.replaceCourses(Set.of(java));
        studentRepository.saveAndFlush(student);

        RestTemplate restTemplate = new RestTemplate();
        StudentResponse[] response = restTemplate.getForObject(
                "http://localhost:" + port + "/api/students", StudentResponse[].class);

        assertThat(response).isNotNull().hasSize(1);
        assertThat(response[0].email()).isEqualTo("aisha@example.edu");
        assertThat(response[0].courses()).singleElement()
                .satisfies(course -> assertThat(course.code()).isEqualTo("CS-101"));
    }
}
