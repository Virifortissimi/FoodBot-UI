import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './components/navbar/navbar';
import { HomeComponent } from './components/home/home';
import { ChatComponent } from './components/chat/chat';
import { PlannerComponent } from './components/planner/planner';
import { LoginComponent } from './components/login/login';
import { PricingComponent } from './components/pricing/pricing';
import { ProfileComponent } from './components/profile/profile';
import { SignupComponent } from './components/signup/signup';
import { BlogComponent } from './components/blog/blog';
import { BlogDetailComponent } from './components/blogdetail/blogdetail';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';
import { NutritionComponent } from './components/nutrition/nutrition';
import { authGuard } from './guards/auth.guard';

import { PrivacyPolicyComponent } from './components/privacy/privacy';
import { TermsServiceComponent } from './components/terms/terms';
import { CookiePolicyComponent } from './components/cookie/cookie';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class App { }

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
      { path: 'planner', component: PlannerComponent, canActivate: [authGuard] },
      { path: 'about', component: AboutComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'blog/:id', component: BlogDetailComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'privacy', component: PrivacyPolicyComponent },
      { path: 'terms', component: TermsServiceComponent },
      { path: 'cookies', component: CookiePolicyComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'nutritionist', component: NutritionComponent, canActivate: [authGuard] },
      { path: 'contact', component: ContactComponent },
      { path: '**', redirectTo: '' }
    ])
  ]
});
