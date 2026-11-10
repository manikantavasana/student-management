import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Course, CoursePayload } from '../core/models';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { CourseFormComponent } from './course-form.component';
import { CourseListComponent } from './course-list.component';
import { CourseStore } from './course.store';

@Component({
  standalone: true,
  imports: [AsyncPipe, CourseListComponent, CourseFormComponent, ConfirmationDialogComponent],
  providers: [CourseStore],
  template: `
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div class="page-heading"><h1 class="h2 fw-bold">Courses</h1><p class="mb-0">Add and manage available courses.</p></div>
      <button type="button" class="btn btn-primary" (click)="startCreate()">+ Add course</button>
    </div>

    @if (store.state$ | async; as vm) {
      @if (vm.error) {
        <div class="alert alert-danger alert-dismissible"><span>{{ vm.error }}</span><button class="btn-close" aria-label="Dismiss" (click)="store.clearError()"></button></div>
      }
      <div class="card">
        <div class="card-header bg-white px-4 pt-3 pb-0 border-0">
          <ul class="nav nav-tabs">
            <li class="nav-item"><button class="nav-link" [class.active]="activeTab === 'catalog'" (click)="activeTab = 'catalog'">Course catalog</button></li>
            <li class="nav-item"><button class="nav-link" [class.active]="activeTab === 'form'" (click)="startCreate()">{{ selectedCourse ? 'Edit course' : 'New course' }}</button></li>
          </ul>
        </div>
        <div class="card-body p-4">
          @if (activeTab === 'catalog') {
            <app-course-list [courses]="vm.courses" (edit)="startEdit($event)" (remove)="requestDelete($event)" />
          } @else {
            <app-course-form [course]="selectedCourse" [busy]="vm.loading" (save)="save($event)" (cancel)="showCatalog()" />
          }
        </div>
      </div>
    }

    <app-confirmation-dialog [open]="courseToDelete !== null" title="Delete course"
      [message]="deleteMessage" (confirm)="confirmDelete()" (cancel)="courseToDelete = null" />
  `
})
export class CoursePageComponent implements OnInit {
  activeTab: 'catalog' | 'form' = 'catalog';
  selectedCourse: Course | null = null;
  courseToDelete: Course | null = null;

  constructor(readonly store: CourseStore) {}

  ngOnInit(): void {
    this.store.load();
  }

  get deleteMessage(): string {
    const course = this.courseToDelete;
    return course ? `Delete ${course.code} - ${course.title}? This cannot be undone.` : '';
  }

  startCreate(): void {
    this.selectedCourse = null;
    this.activeTab = 'form';
  }

  startEdit(course: Course): void {
    this.selectedCourse = course;
    this.activeTab = 'form';
  }

  showCatalog(): void {
    this.selectedCourse = null;
    this.activeTab = 'catalog';
  }

  requestDelete(course: Course): void {
    this.courseToDelete = course;
  }

  save(payload: CoursePayload): void {
    this.store.save(this.selectedCourse, payload, () => this.showCatalog());
  }

  confirmDelete(): void {
    const course = this.courseToDelete;
    if (!course) {
      return;
    }
    this.store.delete(course.id, () => {
      this.courseToDelete = null;
    });
  }
}
