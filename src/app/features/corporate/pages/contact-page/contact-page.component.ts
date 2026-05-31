import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CommunicationsService } from '../../../../core/services/communications.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section style="padding: 8rem 1rem 5rem; background:
      radial-gradient(circle at top left, rgba(22, 198, 90, 0.1), transparent 26%),
      linear-gradient(180deg, var(--surface-base), var(--surface-subtle));">
      <div style="max-width: 74rem; margin: 0 auto;" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-stretch">
          <div class="card" style="padding: 2rem;">
            <p class="type-overline" style="margin-bottom: 1rem;">Contact Us</p>
            <h1 class="type-display" style="margin-bottom: 1.25rem;">Talk to the right team fast.</h1>
            <p class="type-body" style="font-size: 1.05rem; max-width: 40rem;">
              Whether you need product help, want to discuss partnerships, or need API access for a client integration,
              we route you to the right team quickly.
            </p>
            <p class="type-body-s" style="margin-top: 1rem; max-width: 40rem;">
              FoodBot is operated by <a href="https://scalefort.africa" target="_blank" rel="noreferrer" style="color: var(--green-600); font-weight: 700; text-decoration: none;">Scalefort</a>.
              If you are reaching out about platform partnerships or enterprise integrations, you are speaking with the Scalefort team behind FoodBot.
            </p>

            <div class="flex flex-wrap gap-3" style="margin-top: 1.5rem;">
              <a class="btn-outline" href="https://scalefort.africa" target="_blank" rel="noreferrer">Visit Scalefort</a>
              <a routerLink="/api-docs" class="btn-outline">Review API Docs</a>
            </div>
          </div>

          <div class="card-glass" style="padding: 2rem; display: grid; gap: 1rem;">
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">Response target</p>
              <h2 class="type-title" style="margin-bottom: 0.35rem;">Within 1 business day</h2>
              <p class="type-body-s">Most support and partnership emails get a first reply within a working day.</p>
            </div>
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">Best for developers</p>
              <p class="type-body-s" style="margin-bottom: 0.75rem;">If you want API access, send your use case first so we can scope the right endpoints and generate your key.</p>
              <a routerLink="/api-docs" style="color: var(--green-600); font-weight: 700; text-decoration: none;">Review the API docs</a>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div *ngFor="let c of contactChannels" class="card">
            <p class="type-overline" style="margin-bottom: 0.75rem;">{{c.title}}</p>
            <p class="type-body-s" style="min-height: 3.6rem; margin-bottom: 1rem;">{{c.desc}}</p>
            <span style="color: var(--green-600); font-weight: 700;">{{c.email}}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div class="card" style="padding: 2rem;">
            <p class="type-overline" style="margin-bottom: 0.75rem;">Contact Form</p>
            <h2 class="type-title" style="margin-bottom: 1rem;">Send a message</h2>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Name</label>
                  <input [(ngModel)]="contactForm.name" class="form-input" type="text" placeholder="Your name">
                </div>
                <div>
                  <label class="form-label">Email</label>
                  <input [(ngModel)]="contactForm.email" class="form-input" type="email" placeholder="you@example.com">
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Category</label>
                  <select [(ngModel)]="contactForm.category" class="form-input">
                    <option value="support">Support</option>
                    <option value="partnerships">Partnerships</option>
                    <option value="press">Press</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Company</label>
                  <input [(ngModel)]="contactForm.company" class="form-input" type="text" placeholder="Optional">
                </div>
              </div>
              <div>
                <label class="form-label">Subject</label>
                <input [(ngModel)]="contactForm.subject" class="form-input" type="text" placeholder="What is this about?">
              </div>
              <div>
                <label class="form-label">Message</label>
                <textarea [(ngModel)]="contactForm.message" class="form-input" rows="5" placeholder="Tell us what you need."></textarea>
              </div>
              <button class="btn-green" type="button" [disabled]="contactSubmitting || !canSubmitContact()" (click)="submitContact()">
                {{ contactSubmitting ? 'Sending...' : 'Send message' }}
              </button>
            </div>
          </div>

          <div class="card" style="padding: 2rem;">
            <p class="type-overline" style="margin-bottom: 0.75rem;">API Access</p>
            <h2 class="type-title" style="margin-bottom: 1rem;">Request integration access</h2>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Name</label>
                  <input [(ngModel)]="apiForm.name" class="form-input" type="text" placeholder="Your name">
                </div>
                <div>
                  <label class="form-label">Email</label>
                  <input [(ngModel)]="apiForm.email" class="form-input" type="email" placeholder="you@example.com">
                </div>
              </div>
              <div>
                <label class="form-label">Company</label>
                <input [(ngModel)]="apiForm.company" class="form-input" type="text" placeholder="Company or product name">
              </div>
              <div>
                <label class="form-label">Use case</label>
                <textarea [(ngModel)]="apiForm.useCase" class="form-input" rows="4" placeholder="What do you want to build with FoodBot?"></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Expected traffic</label>
                  <input [(ngModel)]="apiForm.expectedTraffic" class="form-input" type="text" placeholder="Optional">
                </div>
                <div>
                  <label class="form-label">Requested endpoints</label>
                  <input [(ngModel)]="apiForm.requestedEndpoints" class="form-input" type="text" placeholder="Optional">
                </div>
              </div>
              <button class="btn-green" type="button" [disabled]="apiSubmitting || !canSubmitApiRequest()" (click)="submitApiAccessRequest()">
                {{ apiSubmitting ? 'Submitting...' : 'Request API access' }}
              </button>
            </div>
          </div>
        </div>

        <div class="card" style="padding: 2rem;">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">Support</p>
              <p class="type-body-s">Include your account email, screenshots, and the steps you took so we can resolve issues faster.</p>
            </div>
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">Integrations</p>
              <p class="type-body-s">For API access, include your use case, expected traffic, and the endpoints you think you need.</p>
            </div>
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">Partnerships</p>
              <p class="type-body-s">Share timelines, rollout context, and what success should look like on both sides for FoodBot and Scalefort.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactPageComponent {
  contactSubmitting = false;
  apiSubmitting = false;

  readonly contactChannels = [
    { title: 'Product Support', desc: 'Account, bugs, billing, and day-to-day help.', email: 'support@foodbot.ng' },
    { title: 'Partnerships', desc: 'Commercial partnerships, distribution, and brand collaborations.', email: 'partners@foodbot.ng' },
    { title: 'API and Integrations', desc: 'Client integrations, custom API access, and technical onboarding.', email: 'api@foodbot.ng' },
    { title: 'Press and Media', desc: 'Interviews, speaking, media assets, and announcements.', email: 'press@foodbot.ng' }
  ];

  contactForm = {
    name: '',
    email: '',
    category: 'support',
    company: '',
    subject: '',
    message: ''
  };

  apiForm = {
    name: '',
    email: '',
    company: '',
    useCase: '',
    expectedTraffic: '',
    requestedEndpoints: ''
  };

  constructor(
    private readonly communicationsService: CommunicationsService,
    private readonly toastService: ToastService
  ) {}

  canSubmitContact(): boolean {
    return !!this.contactForm.name.trim() && !!this.contactForm.email.trim() && !!this.contactForm.message.trim();
  }

  canSubmitApiRequest(): boolean {
    return !!this.apiForm.name.trim() && !!this.apiForm.email.trim() && !!this.apiForm.company.trim() && !!this.apiForm.useCase.trim();
  }

  submitContact(): void {
    if (!this.canSubmitContact() || this.contactSubmitting) {
      return;
    }

    this.contactSubmitting = true;
    this.communicationsService.submitContact(this.contactForm).pipe(
      finalize(() => {
        this.contactSubmitting = false;
      })
    ).subscribe({
      next: () => {
        this.contactForm = {
          name: '',
          email: '',
          category: 'support',
          company: '',
          subject: '',
          message: ''
        };
        this.toastService.success('Your message has been sent. Check your inbox for confirmation.');
      },
      error: () => this.toastService.error('Unable to send your message right now.')
    });
  }

  submitApiAccessRequest(): void {
    if (!this.canSubmitApiRequest() || this.apiSubmitting) {
      return;
    }

    this.apiSubmitting = true;
    this.communicationsService.submitApiAccessRequest(this.apiForm).pipe(
      finalize(() => {
        this.apiSubmitting = false;
      })
    ).subscribe({
      next: () => {
        this.apiForm = {
          name: '',
          email: '',
          company: '',
          useCase: '',
          expectedTraffic: '',
          requestedEndpoints: ''
        };
        this.toastService.success('Your API access request has been submitted. Check your inbox for confirmation.');
      },
      error: () => this.toastService.error('Unable to submit your API request right now.')
    });
  }
}
