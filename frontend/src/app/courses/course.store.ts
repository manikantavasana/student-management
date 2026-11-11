import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, switchMap } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Course, CoursePayload } from '../core/models';

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string;
}

@Injectable()
export class CourseStore {
  private readonly stateSubject = new BehaviorSubject<CourseState>({ courses: [], loading: false, error: '' });
  readonly state$ = this.stateSubject.asObservable();

  constructor(private readonly api: ApiService) {}

  load(): void {
    this.patch({ loading: true, error: '' });
    this.api.getCourses().pipe(finalize(() => this.patch({ loading: false }))).subscribe({
      next: courses => this.patch({ courses }),
      error: (error: Error) => this.patch({ error: error.message })
    });
  }

  save(course: Course | null, payload: CoursePayload, done: () => void): void {
    const request$ = course ? this.api.updateCourse(course.id, payload) : this.api.createCourse(payload);
    this.patch({ loading: true, error: '' });
    request$.pipe(
      switchMap(() => this.api.getCourses()),
      finalize(() => this.patch({ loading: false }))
    ).subscribe({
      next: courses => { this.patch({ courses }); done(); },
      error: (error: Error) => this.patch({ error: error.message })
    });
  }

  delete(id: number, done: () => void): void {
    this.patch({ loading: true, error: '' });
    this.api.deleteCourse(id).pipe(
      switchMap(() => this.api.getCourses()),
      finalize(() => this.patch({ loading: false }))
    ).subscribe({
      next: courses => { this.patch({ courses }); done(); },
      error: (error: Error) => this.patch({ error: error.message })
    });
  }

  clearError(): void { this.patch({ error: '' }); }

  private patch(change: Partial<CourseState>): void {
    this.stateSubject.next({ ...this.stateSubject.value, ...change });
  }
}
