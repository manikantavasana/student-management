import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <nav class="container d-flex flex-wrap align-items-center justify-content-between py-3" aria-label="Primary navigation">
        <a routerLink="/students" class="brand text-decoration-none d-flex align-items-center gap-3">
          <span class="brand-mark" aria-hidden="true">SM</span>
          <span>
            <strong class="d-block">Student Management</strong>
            <small>Students and Courses</small>
          </span>
        </a>
        <div class="nav nav-pills mt-3 mt-md-0">
          <a class="nav-link" routerLink="/students" routerLinkActive="active">Students</a>
          <a class="nav-link" routerLink="/courses" routerLinkActive="active">Courses</a>
        </div>
      </nav>
    </header>
    <main class="container py-4 py-lg-5">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-header { background: #fff; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 100; }
    .brand { color: var(--ink); }
    .brand small { color: var(--muted); }
    .brand-mark { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; color: white; background: var(--brand); font-weight: 800; letter-spacing: .04em; }
    .nav-link { color: var(--muted); font-weight: 600; margin-left: .25rem; }
    .nav-link.active { background: var(--brand); }
  `]
})
export class AppComponent {}
