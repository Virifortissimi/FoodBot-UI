import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-type',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cookie-type">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  `,
  styles: [`
    .cookie-type {
      background: var(--background);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    h3 {
      color: var(--primary);
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    p {
      color: var(--text-light);
      line-height: 1.6;
      margin: 0;
    }
  `]
})
export class CookieTypeComponent {
  @Input() title = '';
  @Input() description = '';
}