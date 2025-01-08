import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './sections/hero.component';
import { NumbersComponent } from './sections/numbers.component';
import { FeaturesSectionComponent } from './sections/features/features-section.component';
import { TestimonialsComponent } from './sections/testimonials.component';
import { CTAComponent } from './sections/cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    NumbersComponent,
    FeaturesSectionComponent,
    TestimonialsComponent,
    CTAComponent
  ],
  template: `
    <div class="home-container">
      <app-hero />
      <app-numbers />
      <app-features-section />
      <app-testimonials />
      <app-cta />
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
    }
  `]
})
export class HomeComponent {}