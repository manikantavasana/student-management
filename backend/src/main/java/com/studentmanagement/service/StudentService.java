package com.studentmanagement.service;

import com.studentmanagement.domain.Course;
import com.studentmanagement.domain.Student;
import com.studentmanagement.dto.StudentRequest;
import com.studentmanagement.dto.StudentResponse;
import com.studentmanagement.exception.BusinessRuleException;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.repository.CourseRepository;
import com.studentmanagement.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public StudentService(StudentRepository studentRepository,
                          CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> findAll() {
        return studentRepository.findAll().stream()
                .sorted(Comparator.comparing(Student::getLastName).thenComparing(Student::getFirstName))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public StudentResponse findById(Long id) {
        return toResponse(getStudent(id));
    }

    @Transactional
    public StudentResponse create(StudentRequest request) {
        ensureEmailAvailable(request.email(), null);
        Student student = new Student(request.firstName(), request.lastName(), request.email());
        student.replaceCourses(resolveCourses(request.courseIds()));
        return toResponse(studentRepository.save(student));
    }

    @Transactional
    public StudentResponse update(Long id, StudentRequest request) {
        Student student = getStudent(id);
        ensureEmailAvailable(request.email(), id);
        student.updateProfile(request.firstName(), request.lastName(), request.email());
        student.replaceCourses(resolveCourses(request.courseIds()));
        return toResponse(studentRepository.save(student));
    }

    @Transactional
    public void delete(Long id) {
        Student student = getStudent(id);
        studentRepository.delete(student);
    }

    private Student getStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));
    }

    private Set<Course> resolveCourses(Set<Long> courseIds) {
        if (courseIds.isEmpty()) {
            return Set.of();
        }

        List<Course> courses = courseRepository.findAllById(courseIds);
        if (courses.size() != courseIds.size()) {
            throw new BusinessRuleException(HttpStatus.BAD_REQUEST,
                    "One or more selected courses do not exist");
        }
        return new LinkedHashSet<>(courses);
    }

    private void ensureEmailAvailable(String email, Long currentId) {
        boolean exists = currentId == null
                ? studentRepository.existsByEmailIgnoreCase(email)
                : studentRepository.existsByEmailIgnoreCaseAndIdNot(email, currentId);
        if (exists) {
            throw new BusinessRuleException(HttpStatus.CONFLICT, "A student with this email already exists");
        }
    }

    private StudentResponse toResponse(Student student) {
        List<StudentResponse.CourseSummary> courses = student.getCourses().stream()
                .sorted(Comparator.comparing(Course::getCode))
                .map(course -> new StudentResponse.CourseSummary(
                        course.getId(), course.getCode(), course.getTitle()))
                .toList();
        return new StudentResponse(student.getId(), student.getFirstName(), student.getLastName(),
                student.getEmail(), courses);
    }
}
