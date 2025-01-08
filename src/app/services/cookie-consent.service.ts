import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieSettings } from '../components/cookie-consent/cookie-settings.model';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private readonly COOKIE_CONSENT_KEY = 'cookie_consent';
  private consentStatusSubject = new BehaviorSubject<boolean>(false);
  
  consentStatus$ = this.consentStatusSubject.asObservable();

  constructor() {
    this.loadConsent();
  }

  private loadConsent(): void {
    const consent = localStorage.getItem(this.COOKIE_CONSENT_KEY);
    this.consentStatusSubject.next(!!consent);
  }

  saveSettings(settings: CookieSettings): void {
    localStorage.setItem(this.COOKIE_CONSENT_KEY, JSON.stringify(settings));
    this.consentStatusSubject.next(true);
  }

  getSettings(): CookieSettings | null {
    const settings = localStorage.getItem(this.COOKIE_CONSENT_KEY);
    return settings ? JSON.parse(settings) : null;
  }

  hasConsent(): boolean {
    return this.consentStatusSubject.value;
  }
}