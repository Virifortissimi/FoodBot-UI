import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureCircleComponent } from './feature-circle.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
  position: { x: number; y: number };
  angle: number;
}

@Component({
  selector: 'app-features-wheel',
  standalone: true,
  imports: [CommonModule, FeatureCircleComponent],
  template: `
    <div class="features-wheel">
      <svg class="wheel-svg" viewBox="0 0 500 500">
        <!-- Outer decorative circles -->
        <circle 
          cx="250" 
          cy="250" 
          r="200" 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          stroke-width="2"
        />
        <circle 
          cx="250" 
          cy="250" 
          r="150" 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          stroke-width="2"
        />
        
        <!-- Connecting lines -->
        @for (feature of features; track feature.title) {
          <line
            [attr.x1]="250"
            [attr.y1]="250"
            [attr.x2]="feature.position.x + 100"
            [attr.y2]="feature.position.y + 100"
            stroke="rgba(255,255,255,0.1)"
            stroke-width="1"
          />
        }

        <!-- Decorative dots -->
        @for (dot of decorativeDots; track dot) {
          <circle
            [attr.cx]="dot.x"
            [attr.cy]="dot.y"
            r="2"
            fill="rgba(255,255,255,0.3)"
          />
        }
      </svg>

      @for (feature of features; track feature.title) {
        <app-feature-circle
          [style.transform]="'translate(' + feature.position.x + 'px, ' + feature.position.y + 'px)'"
          [icon]="feature.icon"
          [title]="feature.title"
          [description]="feature.description"
        />
      }
    </div>
  `,
  styles: [`
    .features-wheel {
      position: relative;
      width: 500px;
      height: 500px;
      margin: 0 auto;
    }

    .wheel-svg {
      position: absolute;
      width: 100%;
      height: 100%;
      animation: rotate 60s linear infinite;
      z-index: 1;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    app-feature-circle {
      position: absolute;
      z-index: 2;
      transition: all 0.5s ease;
    }

    @media (max-width: 768px) {
      .features-wheel {
        width: 400px;
        height: 400px;
      }
    }
  `]
})
export class FeaturesWheelComponent implements OnInit {
  features: Feature[] = [];
  decorativeDots: { x: number; y: number; }[] = [];
  
  ngOnInit() {
    this.initializeFeatures();
    this.createDecorativeDots();
  }

  private initializeFeatures() {
    const radius = 180; // Distance from center
    const centerX = 150; // Offset for feature cards
    const centerY = 150;
    
    const featureData = [
      {
        icon: 'robot',
        title: 'AI Assistant',
        description: '24/7 intelligent nutrition guidance and support',
        angle: 0
      },
      {
        icon: 'calendar-check',
        title: 'Meal Planning',
        description: 'Personalized meal plans based on your preferences',
        angle: 90
      },
      {
        icon: 'chart-line',
        title: 'Progress Tracking',
        description: 'Monitor your nutrition goals and achievements',
        angle: 180
      },
      {
        icon: 'utensils',
        title: 'Recipe Discovery',
        description: 'Find healthy recipes tailored to your diet',
        angle: 270
      }
    ];

    this.features = featureData.map(feature => ({
      ...feature,
      position: {
        x: centerX + radius * Math.cos(feature.angle * Math.PI / 180),
        y: centerY + radius * Math.sin(feature.angle * Math.PI / 180)
      }
    }));
  }

  private createDecorativeDots() {
    const totalDots = 24;
    const radius = 175;
    const centerX = 250;
    const centerY = 250;

    for (let i = 0; i < totalDots; i++) {
      const angle = (i * 360 / totalDots) * Math.PI / 180;
      this.decorativeDots.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }
  }
}