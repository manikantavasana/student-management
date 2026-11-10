import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../core/models';

@Component({
  selector: 'app-course-list',
  standalone: true,
  template: `
    <div class="table-responsive">
      <table class="table align-middle mb-0">
        <thead><tr><th>Code</th><th>Course</th><th class="text-end">Actions</th></tr></thead>
        <tbody>
          @for (course of courses; track course.id) {
            <tr>
              <td><span class="badge-course">{{ course.code }}</span></td>
              <td><strong>{{ course.title }}</strong><span class="d-block text-secondary small description">{{ course.description || 'No description' }}</span></td>
              <td class="text-end text-nowrap">
                <button type="button" class="btn btn-sm btn-outline-primary me-2" (click)="edit.emit(course)">Edit</button>
                <button type="button" class="btn btn-sm btn-outline-danger" (click)="remove.emit(course)">Delete</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="3" class="empty-state">No courses have been added.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`.description { max-width: 620px; }`]
})
export class CourseListComponent {
  @Input({ required: true }) courses: Course[] = [];
  @Output() readonly edit = new EventEmitter<Course>();
  @Output() readonly remove = new EventEmitter<Course>();
}
