import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CookieConsentService } from '../../services/cookie-consent.service';
import { CookieCategoryComponent } from './cookie-category.component';
import { CookieCategory, CookieSettings } from './cookie-settings.model';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterLink, CookieCategoryComponent],
  template: `
    @if (!hasConsent) {
      <div class="cookie-banner" role="alert">
        <div class="banner-content">
          @if (!showSettings) {
            <div class="initial-content">
              <p>
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                <a routerLink="/cookies">Learn more</a>
              </p>
              <div class="banner-actions">
                <button class="btn-settings" (click)="showSettings = true">Cookie Settings</button>
                <button class="btn-accept" (click)="acceptAll()">Accept All</button>
              </div>
            </div>
          } @else {
            <div class="settings-content">
              <h2>Cookie Settings</h2>
              <p class="settings-description">
                Customize your cookie preferences. You can change these settings at any time by visiting our
                <a routerLink="/cookies">Cookie Policy</a>.
              </p>
              
              @for (category of cookieCategories; track category.id) {
                <app-cookie-category
                  [category]="category"
                  [(enabled)]="settings[category.id]"
                />
              }

              <div class="settings-actions">
                <button class="btn-save" (click)="saveSettings()">Save Preferences</button>
                <button class="btn-accept-all" (click)="acceptAll()">Accept All</button>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .banner-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .initial-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .banner-actions, .settings-actions {
      display: flex;
      gap: 1rem;
    }

    .settings-content {
      max-width: 800px;
      margin: 0 auto;
    }

    h2 {
      margin-bottom: 1rem;
    }

    .settings-description {
      margin-bottom: 2rem;
      color: var(--text-light);
    }

    button {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-settings {
      background: transparent;
      border: 1px solid var(--primary);
      color: var(--primary);
    }

    .btn-accept, .btn-accept-all {
      background: var(--primary);
      border: none;
      color: white;
    }

    .btn-save {
      background: var(--secondary);
      border: none;
      color: white;
    }

    button:hover {
      transform: translateY(-2px);
    }

    a {
      color: var(--primary);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .initial-content {
        flex-direction: column;
        text-align: center;
      }

      .banner-actions {
        flex-direction: column;
        width: 100%;
      }

      button {
        width: 100%;
      }
    }
  `]
})
export class CookieBannerComponent implements OnInit {
  hasConsent = false;
  showSettings = false;
  settings: CookieSettings = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  };

  cookieCategories: CookieCategory[] = [
    {
      id: 'necessary',
      name: 'Necessary Cookies',
      description: 'These cookies are required for the website to function properly.',
      required: true
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      required: false
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements.',
      required: false
    },
    {
      id: 'preferences',
      name: 'Preference Cookies',
      description: 'Enable the website to remember your preferences.',
      required: false
    }
  ];

  constructor(private cookieConsentService: CookieConsentService) {}

  ngOnInit(): void {
    this.cookieConsentService.consentStatus$.subscribe(
      status => this.hasConsent = status
    );

    const savedSettings = this.cookieConsentService.getSettings();
    if (savedSettings) {
      this.settings = savedSettings;
    }
  }

  acceptAll(): void {
    const allEnabled: CookieSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    this.cookieConsentService.saveSettings(allEnabled);
    this.hasConsent = true;
  }

  saveSettings(): void {
    this.cookieConsentService.saveSettings(this.settings);
    this.hasConsent = true;
  }
}