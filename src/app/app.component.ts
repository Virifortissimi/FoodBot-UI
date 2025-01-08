import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './components/shared/footer.component';
import { CookieBannerComponent } from './components/cookie-consent/cookie-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FooterComponent, CookieBannerComponent],
  template: `
    <div class="app-container">
      <nav class="main-nav">
        <div class="nav-brand">FoodBot</div>
        <div class="nav-links">
          <a routerLink="/">Home</a>
          <a routerLink="/chat">Chat</a>
          <a routerLink="/meal-planner">Meal Planner</a>
          <a routerLink="/nutritionist">Nutritionist</a>
          <a routerLink="/pricing">Pricing</a>
          @if (isAuthenticated()) {
            <a routerLink="/dashboard">Dashboard</a>
            <button class="nav-button" (click)="logout()">Logout</button>
          } @else {
            <a routerLink="/login">Login</a>
            <a routerLink="/signup">Sign Up</a>
          }
        </div>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>

      @if (!isOnChatPage()) {
        <app-footer></app-footer>
      }

      <app-cookie-banner></app-cookie-banner>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-nav {
      background: #007bff;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }

    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-links a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-button {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid white;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .nav-button:hover {
      background: white;
      color: #007bff;
    }

    main {
      flex: 1;
    }
  `]
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }

  isOnChatPage(): boolean {
    return this.router.url === '/chat';
  }
}