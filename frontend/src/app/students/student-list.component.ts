import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Student } from '../core/models';

@Component({
  selector: 'app-student-list',
  standalone: true,
  template: `
    <div class="table-responsive">
      <table class="table align-middle mb-0">
        <thead><tr><th>Student</th><th>Courses</th><th class="text-end">Actions</th></tr></thead>
        <tbody>
          @for (student of students; track student.id) {
            <tr>
              <td>
                <strong>{{ student.lastName }}, {{ student.firstName }}</strong>
                <span class="d-block text-secondary small">{{ student.email }}</span>
              </td>
              <td>
                @for (course of student.courses; track course.id) { <span class="badge-course">{{ course.code }}</span> }
                @empty { <span class="text-secondary small">Not enrolled</span> }
              </td>
              <td class="text-end text-nowrap">
                <button type="button" class="btn btn-sm btn-outline-primary me-2" (click)="edit.emit(student)">Edit</button>
                <button type="button" class="btn btn-sm btn-outline-danger" (click)="remove.emit(student)">Delete</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="3" class="empty-state">No students have been added.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class StudentListComponent {
  @Input({ required: true }) students: Student[] = [];
  @Output() readonly edit = new EventEmitter<Student>();
  @Output() readonly remove = new EventEmitter<Student>();
}
