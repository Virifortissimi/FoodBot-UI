import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding: 8rem 1rem 5rem; background: var(--surface-base);">
      <div style="max-width: 56rem; margin: 0 auto;">
        <p class="type-overline" style="margin-bottom: 1rem;">Legal</p>
        <h1 class="type-display" style="margin-bottom: 3rem;">Legal & Privacy</h1>

        <div class="space-y-10">
          <!-- Privacy Policy -->
          <div class="card" style="padding: 2.5rem;" id="privacy">
            <h2 class="type-heading" style="margin-bottom: 1rem;">Privacy Policy</h2>
            <div class="card-inset" style="margin-bottom: 1.5rem;">
              <p style="font-weight: 700; color: var(--ink-primary); margin-bottom: 0.25rem;">TL;DR Summary</p>
              <p class="type-body-s">
                In plain terms: We collect only the data we need to run FoodBot. We never sell your data.
                You can delete your account and all associated data at any time. [Read the full policy below]
              </p>
            </div>
            <div class="type-body space-y-3">
              <p>Our complete privacy policy details how we handle your data...</p>
              <p>[Full legal text would go here]</p>
            </div>
          </div>

          <!-- Terms of Service -->
          <div class="card" style="padding: 2.5rem;" id="terms">
            <h2 class="type-heading" style="margin-bottom: 1rem;">Terms of Service</h2>
            <div class="card-inset" style="margin-bottom: 1.5rem;">
              <p style="font-weight: 700; color: var(--ink-primary); margin-bottom: 0.25rem;">TL;DR Summary</p>
              <p class="type-body-s">
                Using FoodBot means you agree to use it respectfully and lawfully. We can suspend accounts that violate these terms.
                Subscriptions auto-renew until cancelled.
              </p>
            </div>
            <div class="type-body space-y-3">
              <p>Our complete terms of service detail the rules of the platform...</p>
              <p>[Full legal text would go here]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LegalPageComponent { }
