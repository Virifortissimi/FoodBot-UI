import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthUser, LoginCredentials, SignupCredentials } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: LoginCredentials): Observable<AuthUser> {
    // Simulate login - In production, this would connect to a backend
    const mockUser: AuthUser = {
      id: '1',
      email: credentials.email,
      name: 'Test User',
      joinedDate: new Date()
    };
    this.currentUserSubject.next(mockUser);
    return of(mockUser);
  }

  signup(credentials: SignupCredentials): Observable<AuthUser> {
    // Simulate signup - In production, this would connect to a backend
    const mockUser: AuthUser = {
      id: '1',
      email: credentials.email,
      name: credentials.name,
      joinedDate: new Date()
    };
    this.currentUserSubject.next(mockUser);
    return of(mockUser);
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}