-- Optional sample data for local development and demonstrations.
--
-- This script is NOT executed automatically by Spring Boot. Start the backend
-- first so Hibernate creates the schema, then run this file from the H2 console.
-- Every INSERT is guarded, so the script can be executed more than once.

INSERT INTO courses (code, title, description)
SELECT 'CS-101', 'Modern Java',
       'Java language and object-oriented design fundamentals.'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE code = 'CS-101');

INSERT INTO courses (code, title, description)
SELECT 'WEB-220', 'Web Application Development',
       'REST APIs, accessibility, and modern browser applications.'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE code = 'WEB-220');

INSERT INTO courses (code, title, description)
SELECT 'DB-310', 'Relational Database Design',
       'Normalization, SQL, indexing, and transactions.'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE code = 'DB-310');

INSERT INTO students (first_name, last_name, email)
SELECT 'Aisha', 'Patel', 'aisha.patel@example.edu'
WHERE NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'aisha.patel@example.edu'
);

INSERT INTO students (first_name, last_name, email)
SELECT 'Daniel', 'Kim', 'daniel.kim@example.edu'
WHERE NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'daniel.kim@example.edu'
);

INSERT INTO students (first_name, last_name, email)
SELECT 'Sofia', 'Rodriguez', 'sofia.rodriguez@example.edu'
WHERE NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'sofia.rodriguez@example.edu'
);

INSERT INTO student_courses (student_id, course_id)
SELECT s.id, c.id
FROM students s
JOIN courses c ON c.code = 'CS-101'
WHERE s.email = 'aisha.patel@example.edu'
  AND NOT EXISTS (
      SELECT 1
      FROM student_courses sc
      WHERE sc.student_id = s.id AND sc.course_id = c.id
  );

INSERT INTO student_courses (student_id, course_id)
SELECT s.id, c.id
FROM students s
JOIN courses c ON c.code = 'DB-310'
WHERE s.email = 'aisha.patel@example.edu'
  AND NOT EXISTS (
      SELECT 1
      FROM student_courses sc
      WHERE sc.student_id = s.id AND sc.course_id = c.id
  );

INSERT INTO student_courses (student_id, course_id)
SELECT s.id, c.id
FROM students s
JOIN courses c ON c.code = 'CS-101'
WHERE s.email = 'daniel.kim@example.edu'
  AND NOT EXISTS (
      SELECT 1
      FROM student_courses sc
      WHERE sc.student_id = s.id AND sc.course_id = c.id
  );

INSERT INTO student_courses (student_id, course_id)
SELECT s.id, c.id
FROM students s
JOIN courses c ON c.code = 'WEB-220'
WHERE s.email = 'daniel.kim@example.edu'
  AND NOT EXISTS (
      SELECT 1
      FROM student_courses sc
      WHERE sc.student_id = s.id AND sc.course_id = c.id
  );

INSERT INTO student_courses (student_id, course_id)
SELECT s.id, c.id
FROM students s
JOIN courses c ON c.code = 'WEB-220'
WHERE s.email = 'sofia.rodriguez@example.edu'
  AND NOT EXISTS (
      SELECT 1
      FROM student_courses sc
      WHERE sc.student_id = s.id AND sc.course_id = c.id
  );
