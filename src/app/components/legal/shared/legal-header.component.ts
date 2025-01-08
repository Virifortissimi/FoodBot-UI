import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="legal-header">
      <h1>{{ title }}</h1>
      <p class="effective-date">Effective Date: January 1, 1970</p>
      <p class="description">{{ description }}</p>
    </header>
  `,
  styles: [`
    .legal-header {
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e2e8f0;
    }

    h1 {
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .effective-date {
      color: var(--text-light);
      margin-bottom: 1rem;
    }

    .description {
      color: var(--text);
      line-height: 1.6;
    }
  `]
})
export class LegalHeaderComponent {
  @Input() title = '';
  @Input() description = '';
}