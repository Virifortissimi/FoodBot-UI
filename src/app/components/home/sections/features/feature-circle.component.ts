import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature-circle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="feature-circle" 
      [class.active]="active"
      (mouseenter)="active = true"
      (mouseleave)="active = false"
    >
      <div class="icon-wrapper">
        <div class="icon">
          <i [class]="'fas fa-' + icon"></i>
        </div>
        <div class="icon-bg"></div>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  `,
  styles: [`
    .feature-circle {
      width: 200px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .icon-wrapper {
      position: relative;
      width: 60px;
      height: 60px;
      margin: 0 auto 1rem;
    }

    .icon {
      position: relative;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      z-index: 2;
    }

    .icon-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: scale(0);
      transition: transform 0.3s ease;
      z-index: 1;
    }

    .icon i {
      font-size: 1.5rem;
      color: var(--primary);
      transition: all 0.3s ease;
    }

    h3 {
      color: white;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
      transition: all 0.3s ease;
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      line-height: 1.4;
      transition: all 0.3s ease;
    }

    .active .icon {
      transform: scale(1.1);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
    }

    .active .icon-bg {
      transform: scale(1.6);
    }

    .active h3 {
      transform: translateY(2px);
    }

    .active p {
      color: rgba(255, 255, 255, 0.95);
    }
  `]
})
export class FeatureCircleComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() description = '';
  active = false;
}