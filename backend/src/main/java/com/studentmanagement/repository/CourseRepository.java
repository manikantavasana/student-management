package com.studentmanagement.repository;

import com.studentmanagement.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CourseRepository extends JpaRepository<Course, Long> {

    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

    @Query("select count(s) from Student s join s.courses c where c.id = :courseId")
    long countStudentsByCourseId(Long courseId);

}
