import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course, Student, StudentPayload } from '../core/models';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
      <div class="row g-3">
        <div class="col-md-6">
          <label for="firstName" class="form-label required">First name</label>
          <input id="firstName" class="form-control" formControlName="firstName" maxlength="80">
          @if (isInvalid('firstName')) { <div class="text-danger small mt-1">First name is required.</div> }
        </div>
        <div class="col-md-6">
          <label for="lastName" class="form-label required">Last name</label>
          <input id="lastName" class="form-control" formControlName="lastName" maxlength="80">
          @if (isInvalid('lastName')) { <div class="text-danger small mt-1">Last name is required.</div> }
        </div>
        <div class="col-12">
          <label for="email" class="form-label required">Email address</label>
          <input id="email" type="email" class="form-control" formControlName="email" maxlength="160">
          @if (isInvalid('email')) { <div class="text-danger small mt-1">Enter a valid email address.</div> }
        </div>
        <fieldset class="col-12">
          <legend class="form-label mb-2">Course enrollment</legend>
          <div class="course-grid">
            @for (course of courses; track course.id) {
              <label class="course-option" [class.selected]="selectedCourseIds.has(course.id)">
                <input type="checkbox" [checked]="selectedCourseIds.has(course.id)" (change)="toggleCourse(course.id)">
                <span><strong>{{ course.code }}</strong><small>{{ course.title }}</small></span>
              </label>
            } @empty {
              <p class="text-secondary mb-0">Add a course before assigning enrollment.</p>
            }
          </div>
        </fieldset>
      </div>
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button type="button" class="btn btn-light" (click)="cancel.emit()">Cancel</button>
        <button type="submit" class="btn btn-primary" [disabled]="busy">{{ student ? 'Save changes' : 'Create student' }}</button>
      </div>
    </form>
  `,
  styles: [`
    .course-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: .65rem; }
    .course-option { display: flex; gap: .65rem; align-items: flex-start; padding: .75rem; border: 1px solid var(--border-color); border-radius: 10px; cursor: pointer; }
    .course-option.selected { border-color: #6b91ad; background: var(--brand-light); }
    .course-option input { margin-top: .25rem; }
    .course-option small { display: block; color: var(--muted); margin-top: .1rem; }
  `]
})
export class StudentFormComponent implements OnChanges {
  @Input() student: Student | null = null;
  @Input({ required: true }) courses: Course[] = [];
  @Input() busy = false;
  @Output() readonly save = new EventEmitter<StudentPayload>();
  @Output() readonly cancel = new EventEmitter<void>();

  readonly form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(160)] })
  });
  selectedCourseIds = new Set<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student']) {
      const student = this.student;
      this.form.reset({ firstName: student?.firstName ?? '', lastName: student?.lastName ?? '', email: student?.email ?? '' });
      this.selectedCourseIds = new Set(student?.courses.map(course => course.id) ?? []);
    }
  }

  toggleCourse(courseId: number): void {
    const next = new Set(this.selectedCourseIds);
    next.has(courseId) ? next.delete(courseId) : next.add(courseId);
    this.selectedCourseIds = next;
  }

  isInvalid(controlName: 'firstName' | 'lastName' | 'email'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit({ ...this.form.getRawValue(), courseIds: [...this.selectedCourseIds] });
  }
}
