import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-feature-education-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-primary-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
      <!-- Decorative element -->
      <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      
      <div class="flex items-start justify-between relative">
        <div class="flex gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">
            {{ icon }}
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-black tracking-tight">{{ title }}</h3>
            <p class="text-primary-100 text-sm leading-relaxed max-w-md">
              {{ description }}
            </p>
          </div>
        </div>
        
        <button (click)="onDismiss.emit()" 
                class="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="mt-4 flex gap-2">
        <button class="px-5 py-2 bg-white text-primary-600 text-xs font-black rounded-xl hover:bg-primary-50 transition-colors">
          Try Now
        </button>
      </div>
    </div>
  `
})
export class FeatureEducationCardComponent {
    @Input({ required: true }) title!: string;
    @Input({ required: true }) description!: string;
    @Input({ required: true }) icon!: string;
    @Output() onDismiss = new EventEmitter<void>();
}
