package com.studentmanagement.service;

import com.studentmanagement.domain.Course;
import com.studentmanagement.dto.CourseRequest;
import com.studentmanagement.dto.CourseResponse;
import com.studentmanagement.exception.BusinessRuleException;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.repository.CourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> findAll() {
        return courseRepository.findAll().stream()
                .sorted(Comparator.comparing(Course::getCode))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse findById(Long id) {
        Course course = getCourse(id);
        return toResponse(course);
    }

    @Transactional
    public CourseResponse create(CourseRequest request) {
        ensureCodeAvailable(request.code(), null);
        Course saved = courseRepository.save(new Course(request.code(), request.title(), request.description()));
        return toResponse(saved);
    }

    @Transactional
    public CourseResponse update(Long id, CourseRequest request) {
        Course course = getCourse(id);
        ensureCodeAvailable(request.code(), id);
        course.update(request.code(), request.title(), request.description());
        return toResponse(courseRepository.save(course));
    }

    @Transactional
    public void delete(Long id) {
        Course course = getCourse(id);
        long enrollmentCount = courseRepository.countStudentsByCourseId(id);
        if (enrollmentCount > 0) {
            throw new BusinessRuleException(HttpStatus.CONFLICT,
                    "Course cannot be deleted while " + enrollmentCount + " student(s) are enrolled");
        }
        courseRepository.delete(course);
    }

    private Course getCourse(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", id));
    }

    private void ensureCodeAvailable(String code, Long currentId) {
        boolean exists = currentId == null
                ? courseRepository.existsByCodeIgnoreCase(code)
                : courseRepository.existsByCodeIgnoreCaseAndIdNot(code, currentId);
        if (exists) {
            throw new BusinessRuleException(HttpStatus.CONFLICT, "A course with this code already exists");
        }
    }

    private CourseResponse toResponse(Course course) {
        return new CourseResponse(course.getId(), course.getCode(), course.getTitle(), course.getDescription());
    }
}
