import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieCategory } from './cookie-settings.model';

@Component({
  selector: 'app-cookie-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cookie-category">
      <div class="category-header">
        <div class="category-title">
          <h3>{{ category.name }}</h3>
          @if (category.required) {
            <span class="required-badge">Required</span>
          }
        </div>
        <label class="toggle">
          <input
            type="checkbox"
            [checked]="enabled"
            (change)="toggleCategory()"
            [disabled]="category.required"
          >
          <span class="slider"></span>
        </label>
      </div>
      <p class="category-description">{{ category.description }}</p>
    </div>
  `,
  styles: [`
    .cookie-category {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .category-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    h3 {
      margin: 0;
      font-size: 1rem;
    }

    .required-badge {
      background: #e2e8f0;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .category-description {
      color: var(--text-light);
      font-size: 0.875rem;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #cbd5e1;
      transition: .3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: var(--primary);
    }

    input:disabled + .slider {
      opacity: 0.5;
      cursor: not-allowed;
    }

    input:checked + .slider:before {
      transform: translateX(24px);
    }
  `]
})
export class CookieCategoryComponent {
  @Input() category!: CookieCategory;
  @Input() enabled = false;
  @Output() enabledChange = new EventEmitter<boolean>();

  toggleCategory(): void {
    if (!this.category.required) {
      this.enabled = !this.enabled;
      this.enabledChange.emit(this.enabled);
    }
  }
}