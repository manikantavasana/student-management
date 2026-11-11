import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course, CoursePayload, Student, StudentPayload } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`);
  }

  createStudent(payload: StudentPayload): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/students`, payload);
  }

  updateStudent(id: number, payload: StudentPayload): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/students/${id}`, payload);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/students/${id}`);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses`);
  }

  createCourse(payload: CoursePayload): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/courses`, payload);
  }

  updateCourse(id: number, payload: CoursePayload): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/courses/${id}`, payload);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/${id}`);
  }
}
