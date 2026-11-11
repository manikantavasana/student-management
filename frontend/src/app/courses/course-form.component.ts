import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course, CoursePayload } from '../core/models';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submitForm()" novalidate>
      <div class="row g-3">
        <div class="col-md-4">
          <label for="code" class="form-label required">Course code</label>
          <input id="code" class="form-control text-uppercase" formControlName="code" placeholder="CS-101" maxlength="11">
          @if (isInvalid('code')) { <div class="text-danger small mt-1">Use a code such as CS-101.</div> }
        </div>
        <div class="col-md-8">
          <label for="title" class="form-label required">Course title</label>
          <input id="title" class="form-control" formControlName="title" maxlength="120">
          @if (isInvalid('title')) { <div class="text-danger small mt-1">Course title is required.</div> }
        </div>
        <div class="col-12">
          <label for="description" class="form-label">Description</label>
          <textarea id="description" class="form-control" formControlName="description" rows="4" maxlength="500"></textarea>
          <div class="text-secondary small mt-1 text-end">{{ form.controls.description.value.length }}/500</div>
        </div>
      </div>
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button type="button" class="btn btn-light" (click)="cancel.emit()">Cancel</button>
        <button type="submit" class="btn btn-primary" [disabled]="busy">{{ course ? 'Save changes' : 'Create course' }}</button>
      </div>
    </form>
  `
})
export class CourseFormComponent implements OnChanges {
  @Input() course: Course | null = null;
  @Input() busy = false;
  @Output() readonly save = new EventEmitter<CoursePayload>();
  @Output() readonly cancel = new EventEmitter<void>();

  readonly form = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/[A-Za-z]{2,6}-?[0-9]{2,4}/)] }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] })
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      this.form.reset({ code: this.course?.code ?? '', title: this.course?.title ?? '', description: this.course?.description ?? '' });
    }
  }

  isInvalid(controlName: 'code' | 'title'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.save.emit({ ...value, code: value.code.toUpperCase(), description: value.description.trim() || null });
  }
}
