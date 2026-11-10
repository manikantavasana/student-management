import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'students' },
  {
    path: 'students',
    title: 'Students | Student Management',
    loadComponent: () => import('./students/student-page.component').then(module => module.StudentPageComponent)
  },
  {
    path: 'courses',
    title: 'Courses | Student Management',
    loadComponent: () => import('./courses/course-page.component').then(module => module.CoursePageComponent)
  },
  { path: '**', redirectTo: 'students' }
];
