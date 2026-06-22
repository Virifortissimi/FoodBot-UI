import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterPreloader } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthPreloadStateService } from './auth-preload-state.service';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  onboardingCompleted: boolean;
}

export interface AuthResponse {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  user: User;
}

export interface AuthRegistrationPendingResponse {
  requiresEmailVerification: boolean;
  email: string;
}

interface AuthPublicKeyResponse {
  keyId: string;
  algorithm: string;
  publicKeySpkiBase64: string;
  expiresAtUtc: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly SESSION_HINT_KEY = 'foodbot_session_hint';
  private apiUrl = `${environment.apiUrl}/auth`;
  private refreshPromise: Promise<string | null> | null = null;
  private publicKeyPromise: Promise<AuthPublicKeyResponse> | null = null;
  private cachedPublicKey: AuthPublicKeyResponse | null = null;

  user = signal<User | null>(null);
  token = signal<string | null>(null);
  initialized = signal(false);
  sessionHint = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private routerPreloader: RouterPreloader,
    private authPreloadState: AuthPreloadStateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.clearLegacyStoredSession();
    this.sessionHint.set(this.readSessionHint());
  }

  async initialize() {
    if (this.initialized()) {
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      this.initialized.set(true);
      return;
    }

    if (!this.sessionHint()) {
      this.initialized.set(true);
      return;
    }

    try {
      await this.refreshSession(true);
    } finally {
      this.initialized.set(true);
    }
  }

  async signIn(email: string, password?: string, retryWithFreshKey = true): Promise<AuthResponse> {
    try {
      const payload = await this.buildEncryptedLoginPayload(email, password || '');
      const res = await firstValueFrom(this.http.post<any>(
        `${this.apiUrl}/login`,
        payload,
        { withCredentials: true }
      ));

      if (!res?.success || !res?.data) {
        throw new Error(res?.errors?.[0] || 'Login failed.');
      }

      return this.handleAuth(res.data as AuthResponse);
    } catch (err) {
      const message = this.extractErrorMessage(err);
      if (retryWithFreshKey && this.isStaleEncryptedPayloadError(message)) {
        this.clearCachedPublicKey();
        return this.signIn(email, password, false);
      }

      throw new Error(message);
    }
  }

  async resendVerification(email: string) {
    try {
      const res = await firstValueFrom(this.http.post<any>(
        `${this.apiUrl}/resend-verification`,
        { email }
      ));

      if (!res?.success) {
        throw new Error(res?.errors?.[0] || 'Unable to send verification email.');
      }

      return true;
    } catch (err) {
      throw new Error(this.extractErrorMessage(err));
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const res = await firstValueFrom(this.http.post<any>(
        `${this.apiUrl}/forgot-password`,
        { email }
      ));

      if (!res?.success) {
        throw new Error(res?.errors?.[0] || 'Unable to send password reset email.');
      }

      return true;
    } catch (err) {
      throw new Error(this.extractErrorMessage(err));
    }
  }

  async signUp(
    email: string,
    firstName: string,
    lastName: string,
    password?: string,
    retryWithFreshKey = true
  ): Promise<AuthResponse | AuthRegistrationPendingResponse> {
    try {
      const payload = await this.buildEncryptedRegisterPayload(email, firstName, lastName, password || '');
      const res = await firstValueFrom(this.http.post<any>(
        `${this.apiUrl}/register`,
        payload,
        { withCredentials: true }
      ));

      if (!res?.success || !res?.data) {
        throw new Error(res?.errors?.[0] || 'Failed to create account.');
      }

      if (res.data?.requiresEmailVerification) {
        return res.data as AuthRegistrationPendingResponse;
      }

      return this.handleAuth(res.data as AuthResponse);
    } catch (err) {
      const message = this.extractErrorMessage(err);
      if (retryWithFreshKey && this.isStaleEncryptedPayloadError(message)) {
        this.clearCachedPublicKey();
        return this.signUp(email, firstName, lastName, password, false);
      }

      throw new Error(message);
    }
  }

  async completeSessionFromAccessToken(accessToken: string) {
    const trimmedToken = (accessToken || '').trim();
    if (!trimmedToken) {
      throw new Error('Missing access token from verification link.');
    }

    if (this.isTokenExpired(trimmedToken)) {
      throw new Error('This verification session has expired. Please sign in again.');
    }

    try {
      const exchange = await firstValueFrom(this.http.post<any>(
        `${this.apiUrl}/exchange`,
        { accessToken: trimmedToken },
        { withCredentials: true }
      ));

      if (!exchange?.success || !exchange?.data) {
        throw new Error('Email was verified, but we could not start your session. Please sign in.');
      }

      return this.handleAuth(exchange.data as AuthResponse);
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async ensureValidToken(): Promise<string | null> {
    const currentToken = this.token();
    if (currentToken && !this.isTokenExpired(currentToken)) {
      return currentToken;
    }

    return this.refreshSession(true);
  }

  async refreshSession(silent = false): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = firstValueFrom(this.http.post<any>(
      `${this.apiUrl}/refresh`,
      {},
      { withCredentials: true }
    )).then(res => {
      if (!res?.success || !res?.data) {
        this.clearSessionState();
        return null;
      }

      const auth = this.handleAuth(res.data as AuthResponse);
      return auth.accessToken;
    }).catch(err => {
      if (!silent) {
        console.error('Session refresh failed', err);
      }

      this.clearSessionState();
      return null;
    }).finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  async signOut(redirect = true) {
    try {
      if (isPlatformBrowser(this.platformId)) {
        await firstValueFrom(this.http.post<any>(
          `${this.apiUrl}/logout`,
          {},
          { withCredentials: true }
        ));
      }
    } catch {
      // Ignore logout transport failures and clear local state regardless.
    }

    this.clearSessionState();

    if (redirect) {
      this.router.navigate(['/auth/login']);
    }
  }

  private handleAuth(response: AuthResponse) {
    const normalizedToken = (response?.accessToken || '').trim();
    if (!this.looksLikeJwt(normalizedToken)) {
      throw new Error('Received an invalid session token. Please sign in again.');
    }

    this.token.set(normalizedToken);
    this.user.set(response.user);
    this.persistSessionHint(true);
    this.authPreloadState.enable();
    if (isPlatformBrowser(this.platformId)) {
      queueMicrotask(() => this.routerPreloader.preload().subscribe());
    }
    return { ...response, accessToken: normalizedToken };
  }

  private clearSessionState() {
    const currentUserId = this.user()?.id;
    this.token.set(null);
    this.user.set(null);
    this.authPreloadState.disable();
    this.persistSessionHint(false);
    this.clearLegacyStoredSession();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('foodbot.recipe-chat.messages.v1');
      this.clearLocalStoragePrefix(`foodbot.recipe-chat.messages.v1.${currentUserId || 'anonymous'}`);
      this.clearCachedUserData(currentUserId);
    }
  }

  private clearCachedUserData(userId?: string) {
    const cachePrefix = `foodbot.cache.v1.${userId || 'anonymous'}`;
    this.clearLocalStoragePrefix(cachePrefix);
  }

  private clearLocalStoragePrefix(prefix: string) {
    for (let index = localStorage.length - 1; index >= 0; index--) {
      const key = localStorage.key(index);
      if (key?.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
  }

  private extractErrorMessage(error: any): string {
    if (error?.status === 401) {
      return 'Verification session is invalid or expired. Request a new email link or sign in manually.';
    }

    if (error?.status === 504) {
      return 'Secure sign-in is taking longer than expected. Please try again shortly.';
    }

    if (error?.status >= 500) {
      return 'Secure sign-in is temporarily unavailable. Please try again shortly.';
    }

    if (error?.status === 0) {
      return 'Unable to reach secure sign-in. Check your connection and try again.';
    }

    const candidates = [
      error?.error?.errors?.[0],
      error?.error?.message,
      error?.message
    ];

    for (const candidate of candidates) {
      const normalized = this.normalizeErrorCandidate(candidate);
      if (normalized) {
        return normalized;
      }
    }

    return 'Request failed.';
  }

  private normalizeErrorCandidate(candidate: any): string | null {
    if (candidate == null) {
      return null;
    }

    if (typeof candidate === 'object') {
      const objectMessage = candidate.msg || candidate.message || candidate.error_description;
      if (typeof objectMessage === 'string' && objectMessage.trim()) {
        return objectMessage.trim();
      }
      return null;
    }

    const text = String(candidate).trim();
    if (!text) {
      return null;
    }

    if (this.isRawHttpFailureMessage(text)) {
      return 'Secure sign-in is temporarily unavailable. Please try again shortly.';
    }

    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        const parsedMessage = parsed.msg || parsed.message || parsed.error_description;
        if (typeof parsedMessage === 'string' && parsedMessage.trim()) {
          return parsedMessage.trim();
        }
      }
    } catch {
      // Not JSON, use raw text.
    }

    return text;
  }

  private isRawHttpFailureMessage(message: string): boolean {
    const normalized = message.toLowerCase();
    return normalized.startsWith('http failure response')
      || normalized.includes('/api/v1/auth/public-key')
      || normalized.includes('gateway timeout');
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') {
      return false;
    }

    const currentUnixTime = Math.floor(Date.now() / 1000);
    return payload.exp <= currentUnixTime;
  }

  private decodeJwtPayload(token: string): any | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    try {
      const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
      const payload = atob(normalized + padding);
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  private looksLikeJwt(value: string): boolean {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return false;
    }

    const parts = trimmed.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  private clearLegacyStoredSession() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private readSessionHint(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return localStorage.getItem(AuthService.SESSION_HINT_KEY) === '1';
  }

  private persistSessionHint(value: boolean) {
    this.sessionHint.set(value);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (value) {
      localStorage.setItem(AuthService.SESSION_HINT_KEY, '1');
      return;
    }

    localStorage.removeItem(AuthService.SESSION_HINT_KEY);
  }

  private async buildEncryptedLoginPayload(email: string, password: string) {
    const publicKey = await this.getAuthPublicKey();
    const timestampUnixSeconds = Math.floor(Date.now() / 1000);
    const nonce = this.generateNonce();

    return {
      keyId: publicKey.keyId,
      emailCiphertext: await this.encryptValue(email, publicKey.publicKeySpkiBase64),
      passwordCiphertext: await this.encryptValue(password, publicKey.publicKeySpkiBase64),
      timestampUnixSeconds,
      nonce
    };
  }

  private async buildEncryptedRegisterPayload(email: string, firstName: string, lastName: string, password: string) {
    const publicKey = await this.getAuthPublicKey();
    const timestampUnixSeconds = Math.floor(Date.now() / 1000);
    const nonce = this.generateNonce();
    const normalizedFirstName = firstName?.trim() || '';
    const normalizedLastName = lastName?.trim() || '';
    const fullName = `${normalizedFirstName} ${normalizedLastName}`.trim();

    return {
      keyId: publicKey.keyId,
      emailCiphertext: await this.encryptValue(email, publicKey.publicKeySpkiBase64),
      passwordCiphertext: await this.encryptValue(password, publicKey.publicKeySpkiBase64),
      firstNameCiphertext: normalizedFirstName
        ? await this.encryptValue(normalizedFirstName, publicKey.publicKeySpkiBase64)
        : null,
      lastNameCiphertext: normalizedLastName
        ? await this.encryptValue(normalizedLastName, publicKey.publicKeySpkiBase64)
        : null,
      fullNameCiphertext: fullName?.trim()
        ? await this.encryptValue(fullName, publicKey.publicKeySpkiBase64)
        : null,
      timestampUnixSeconds,
      nonce
    };
  }

  private async getAuthPublicKey(): Promise<AuthPublicKeyResponse> {
    if (this.cachedPublicKey && !this.isPublicKeyExpired(this.cachedPublicKey)) {
      return this.cachedPublicKey;
    }

    if (this.publicKeyPromise) {
      return this.publicKeyPromise;
    }

    this.publicKeyPromise = firstValueFrom(
      this.http.get<{ success: boolean; data: AuthPublicKeyResponse }>(`${this.apiUrl}/public-key`)
    ).then(res => {
      if (!res?.success || !res?.data) {
        throw new Error('Unable to initialize secure authentication.');
      }

      this.cachedPublicKey = res.data;
      return res.data;
    }).finally(() => {
      this.publicKeyPromise = null;
    });

    return this.publicKeyPromise;
  }

  private isPublicKeyExpired(publicKey: AuthPublicKeyResponse): boolean {
    const expiresAt = Date.parse(publicKey.expiresAtUtc);
    if (Number.isNaN(expiresAt)) {
      return true;
    }

    return expiresAt <= Date.now() + 60_000;
  }

  private clearCachedPublicKey() {
    this.cachedPublicKey = null;
    this.publicKeyPromise = null;
  }

  private isStaleEncryptedPayloadError(message: string): boolean {
    const normalized = (message || '').toLowerCase();
    return normalized.includes('invalid login payload')
      || normalized.includes('invalid registration payload')
      || normalized.includes('auth payload key')
      || normalized.includes('unable to decrypt auth payload');
  }

  private async encryptValue(value: string, publicKeySpkiBase64: string): Promise<string> {
    if (!isPlatformBrowser(this.platformId) || !window.crypto?.subtle) {
      throw new Error('Secure authentication is unavailable in this environment.');
    }

    const publicKeyBytes = this.base64ToBytes(publicKeySpkiBase64);
    const cryptoKey = await window.crypto.subtle.importKey(
      'spki',
      publicKeyBytes,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      cryptoKey,
      new TextEncoder().encode(value)
    );

    return this.bytesToBase64(new Uint8Array(encrypted));
  }

  private generateNonce(): string {
    if (isPlatformBrowser(this.platformId) && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }

  private base64ToBytes(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
  }

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = '';

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }
}
