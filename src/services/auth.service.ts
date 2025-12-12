import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    user: null,
    loading: false,
    error: null
  });

  public authState$ = this.authState.asObservable();

  // Simple in-memory user storage
  private users: Map<string, { password: string; fullName: string }> = new Map();
  
  // Default admin user
  private readonly ADMIN_EMAIL = 'admin';
  private readonly ADMIN_PASSWORD = 'admin';
  private readonly ADMIN_NAME = 'Administrator';

  constructor() {
    // Initialize with admin user
    this.users.set(this.ADMIN_EMAIL, {
      password: this.ADMIN_PASSWORD,
      fullName: this.ADMIN_NAME
    });

    // Check if user is already logged in (from localStorage)
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    try {
      const storedUser = localStorage.getItem('foodbot_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.authState.next({
          user,
          loading: false,
          error: null
        });
      } else {
        this.authState.next({
          user: null,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      localStorage.removeItem('foodbot_user');
      this.authState.next({
        user: null,
        loading: false,
        error: null
      });
    }
  }

  async signUp(email: string, password: string, fullName: string): Promise<{success: boolean, error?: string}> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!email || !password || !fullName) {
      return { success: false, error: 'Please fill in all fields' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    // Check if user already exists
    if (this.users.has(email.toLowerCase())) {
      return { success: false, error: 'User already exists' };
    }

    // Create new user
    this.users.set(email.toLowerCase(), {
      password: password,
      fullName: fullName
    });

    return { success: true };
  }

  async signIn(email: string, password: string): Promise<{success: boolean, error?: string}> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!email || !password) {
      return { success: false, error: 'Please fill in all fields' };
    }

    const emailLower = email.toLowerCase();
    const userData = this.users.get(emailLower);

    if (!userData || userData.password !== password) {
      this.authState.next({
        ...this.authState.value,
        error: 'Invalid email or password'
      });
      return { success: false, error: 'Invalid email or password' };
    }

    // Create user object
    const user: User = {
      id: emailLower,
      email: emailLower,
      full_name: userData.fullName
    };

    // Store in localStorage
    localStorage.setItem('foodbot_user', JSON.stringify(user));

    // Update auth state
    this.authState.next({
      user,
      loading: false,
      error: null
    });

    return { success: true };
  }

  async signOut(): Promise<{success: boolean, error?: string}> {
    // Remove from localStorage
    localStorage.removeItem('foodbot_user');

    // Update auth state
    this.authState.next({
      user: null,
      loading: false,
      error: null
    });

    return { success: true };
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  isAuthenticated(): boolean {
    return this.authState.value.user !== null;
  }

  isLoading(): boolean {
    return this.authState.value.loading;
  }
}
