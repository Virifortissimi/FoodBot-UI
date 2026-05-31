import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'fb-toast-container',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      @for (toast of toastService.toasts$ | async; track toast.id) {
        <div class="toast" [class]="toast.type" @slideIn>
          <div class="toast-content">
            <span class="toast-icon">
              @if (toast.type === 'success') { ✅ }
              @else if (toast.type === 'error') { ❌ }
              @else if (toast.type === 'warning') { ⚠️ }
              @else { ℹ️ }
            </span>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" (click)="toastService.remove(toast.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      min-width: 300px;
      max-width: 450px;
      padding: 1rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }

    .toast.success { background: rgba(34, 197, 94, 0.9); }
    .toast.error { background: rgba(239, 68, 68, 0.9); }
    .toast.info { background: rgba(59, 130, 246, 0.9); }
    .toast.warning { background: rgba(245, 158, 11, 0.9); }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .toast-icon {
      font-size: 1.25rem;
    }

    .toast-message {
      font-weight: 500;
      font-size: 0.875rem;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.375rem;
      transition: all 0.2s;
    }

    .toast-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  `],
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms cubic-bezier(0.23, 1, 0.32, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class ToastContainerComponent {
    toastService = inject(ToastService);
}
