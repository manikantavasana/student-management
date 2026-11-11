import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, switchMap } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Student, StudentPayload } from '../core/models';

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string;
}

@Injectable()
export class StudentStore {
  private readonly stateSubject = new BehaviorSubject<StudentState>({ students: [], loading: false, error: '' });
  readonly state$ = this.stateSubject.asObservable();

  constructor(private readonly api: ApiService) {}

  load(): void {
    this.patch({ loading: true, error: '' });
    this.api.getStudents().pipe(finalize(() => this.patch({ loading: false }))).subscribe({
      next: students => this.patch({ students }),
      error: (error: Error) => this.patch({ error: error.message })
    });
  }

  save(student: Student | null, payload: StudentPayload, done: () => void): void {
    const request$ = student ? this.api.updateStudent(student.id, payload) : this.api.createStudent(payload);
    this.patch({ loading: true, error: '' });
    request$.pipe(
      switchMap(() => this.api.getStudents()),
      finalize(() => this.patch({ loading: false }))
    ).subscribe({
      next: students => { this.patch({ students }); done(); },
      error: (error: Error) => this.patch({ error: error.message })
    });
  }

  delete(id: number, done: () => void): void {
    this.patch({ loading: true, error: '' });
    this.api.deleteStudent(id).pipe(
      switchMap(() => this.api.getStudents()),
      finalize(() => this.patch({ loading: false }))
    ).subscribe({
      next: students => { this.patch({ students }); done(); },
      error: (error: Error) => this.patch({ error: error.message })
    });
  }

  clearError(): void { this.patch({ error: '' }); }

  private patch(change: Partial<StudentState>): void {
    this.stateSubject.next({ ...this.stateSubject.value, ...change });
  }
}
