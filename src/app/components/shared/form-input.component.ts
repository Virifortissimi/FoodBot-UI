import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field">
      <label [for]="id" class="form-label">{{ label }}</label>
      <div class="input-wrapper">
        <i [class]="'fas fa-' + icon" class="input-icon"></i>
        <input
          [type]="type"
          [id]="id"
          [placeholder]="placeholder"
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
          class="form-input"
          [required]="required"
        />
      </div>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      margin-bottom: 0.5rem;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 2.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-input::placeholder {
      color: #94a3b8;
    }
  `]
})
export class FormInputComponent {
  @Input() type = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() icon = '';
  @Input() id = '';
  @Input() required = false;
  @Input() value = '';
  @Input() onValueChange = (value: string) => {};
}