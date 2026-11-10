import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => next(request).pipe(
  catchError((error: HttpErrorResponse) => {
    const problem = error.error as { detail?: string } | null;
    const message = problem?.detail || (error.status === 0
      ? 'The API is unavailable. Confirm the backend is running on port 8081.'
      : 'The request could not be completed.');
    return throwError(() => new Error(message));
  })
);
