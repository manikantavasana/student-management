import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, combineLatest, map, of } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Course, Student, StudentPayload } from '../core/models';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { StudentFormComponent } from './student-form.component';
import { StudentListComponent } from './student-list.component';
import { StudentStore } from './student.store';

@Component({
  standalone: true,
  imports: [AsyncPipe, StudentListComponent, StudentFormComponent, ConfirmationDialogComponent],
  providers: [StudentStore],
  template: `
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div class="page-heading"><h1 class="h2 fw-bold">Students</h1><p class="mb-0">Add students and assign their courses.</p></div>
      <button type="button" class="btn btn-primary" (click)="startCreate()">+ Add student</button>
    </div>

    @if (vm$ | async; as vm) {
      @if (vm.error) {
        <div class="alert alert-danger alert-dismissible"><span>{{ vm.error }}</span><button class="btn-close" aria-label="Dismiss" (click)="store.clearError()"></button></div>
      }
      <div class="card">
        <div class="card-header bg-white px-4 pt-3 pb-0 border-0">
          <ul class="nav nav-tabs">
            <li class="nav-item"><button class="nav-link" [class.active]="activeTab === 'records'" (click)="activeTab = 'records'">Student records</button></li>
            <li class="nav-item"><button class="nav-link" [class.active]="activeTab === 'form'" (click)="startCreate()">{{ selectedStudent ? 'Edit student' : 'New student' }}</button></li>
          </ul>
        </div>
        <div class="card-body p-4">
          @if (activeTab === 'records') {
            <app-student-list [students]="vm.students" (edit)="startEdit($event)" (remove)="requestDelete($event)" />
          } @else {
            <app-student-form [student]="selectedStudent" [courses]="vm.courses" [busy]="vm.loading" (save)="save($event)" (cancel)="showRecords()" />
          }
        </div>
      </div>
    }

    <app-confirmation-dialog [open]="studentToDelete !== null" title="Delete student"
      [message]="deleteMessage" (confirm)="confirmDelete()" (cancel)="studentToDelete = null" />
  `
})
export class StudentPageComponent implements OnInit {
  readonly courses$ = this.api.getCourses().pipe(catchError(() => of([])));
  readonly vm$ = combineLatest([this.store.state$, this.courses$])
    .pipe(map(([state, courses]) => ({ ...state, courses })));

  activeTab: 'records' | 'form' = 'records';
  selectedStudent: Student | null = null;
  studentToDelete: Student | null = null;

  constructor(readonly store: StudentStore, private readonly api: ApiService) {}

  ngOnInit(): void {
    this.store.load();
  }

  get deleteMessage(): string {
    const student = this.studentToDelete;
    return student ? `Delete ${student.firstName} ${student.lastName}? This cannot be undone.` : '';
  }

  startCreate(): void {
    this.selectedStudent = null;
    this.activeTab = 'form';
  }

  startEdit(student: Student): void {
    this.selectedStudent = student;
    this.activeTab = 'form';
  }

  showRecords(): void {
    this.selectedStudent = null;
    this.activeTab = 'records';
  }

  requestDelete(student: Student): void {
    this.studentToDelete = student;
  }

  save(payload: StudentPayload): void {
    this.store.save(this.selectedStudent, payload, () => this.showRecords());
  }

  confirmDelete(): void {
    const student = this.studentToDelete;
    if (!student) {
      return;
    }
    this.store.delete(student.id, () => {
      this.studentToDelete = null;
    });
  }
}
