import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';
import { DeviceModeService } from '../../../core/services/device-mode.service';

@Component({
  selector: 'fb-settings-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6" (click)="close.emit()">
      <div class="card-glass w-full max-w-sm overflow-hidden animate-slide-up" (click)="$event.stopPropagation()">
        <div class="p-6 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="type-title" style="margin: 0;">App Settings</h2>
            <button (click)="close.emit()" class="btn-ghost" style="padding: 0.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-faint)]">
              <div class="flex items-center gap-3">
                <span style="font-size: 1.25rem;">{{ themeService.theme() === 'dark' ? '🌙' : '☀️' }}</span>
                <div>
                  <p style="font-weight: 600; font-size: 0.875rem; color: var(--ink-primary); margin: 0;">Dark Mode</p>
                  <p class="type-body-s" style="margin: 0;">Sleek night-time look</p>
                </div>
              </div>
              <button
                (click)="themeService.toggleTheme(); toastService.info('Theme updated', 1500)"
                class="w-12 h-6 rounded-full transition-colors relative"
                [style.backgroundColor]="themeService.theme() === 'dark' ? 'var(--green-500)' : 'var(--border-default)'">
                <div class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                  [style.left]="themeService.theme() === 'dark' ? '28px' : '4px'"></div>
              </button>
            </div>

            <div class="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-faint)]">
              <div class="flex items-center gap-3">
                <span style="font-size: 1.25rem;">💻</span>
                <div>
                  <p style="font-weight: 600; font-size: 0.875rem; color: var(--ink-primary); margin: 0;">PC Setting</p>
                  <p class="type-body-s" style="margin: 0;">{{ pcSettingDescription }}</p>
                </div>
              </div>
              <button
                (click)="togglePCMode()"
                class="w-12 h-6 rounded-full transition-colors relative"
                [style.backgroundColor]="deviceModeService.pcMode() ? 'var(--green-500)' : 'var(--border-default)'">
                <div class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                  [style.left]="deviceModeService.pcMode() ? '28px' : '4px'"></div>
              </button>
            </div>
          </div>

          <button (click)="close.emit()" class="btn-dark w-full">Done</button>
        </div>
      </div>
    </div>
  `,
})
export class SettingsPanelComponent {
  @Output() close = new EventEmitter<void>();

  readonly themeService = inject(ThemeService);
  readonly deviceModeService = inject(DeviceModeService);
  readonly toastService = inject(ToastService);

  get pcSettingDescription(): string {
    if (this.deviceModeService.hasManualOverride()) {
      return this.deviceModeService.pcMode()
        ? 'Desktop optimization forced on'
        : 'Desktop optimization forced off';
    }

    return this.deviceModeService.isDesktopDevice()
      ? 'Desktop detected automatically'
      : 'Mobile device detected automatically';
  }

  togglePCMode(): void {
    const enabled = this.deviceModeService.togglePcMode();
    this.toastService.info(enabled ? 'Desktop optimization enabled' : 'Desktop optimization disabled', 1500);
  }
}
