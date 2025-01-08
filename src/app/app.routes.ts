import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChatComponent } from './components/chat/chat.component';
import { MealPlannerComponent } from './components/meal-planner/meal-planner.component';
import { NutritionistComponent } from './components/nutritionist/nutritionist.component';
import { LoginComponent } from './components/auth/login.component';
import { SignupComponent } from './components/auth/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { PrivacyComponent } from './components/legal/privacy.component';
import { TermsComponent } from './components/legal/terms/terms.component';
import { AboutComponent } from './components/about/about.component';
import { CareersComponent } from './components/careers/careers.component';
import { ContactComponent } from './components/contact/contact.component';
import { CookiePolicyComponent } from './components/legal/cookie-policy/cookie-policy.component';
import { FeaturesComponent } from './components/features/features.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'meal-planner', component: MealPlannerComponent },
  { path: 'nutritionist', component: NutritionistComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'cookies', component: CookiePolicyComponent },
  { path: 'about', component: AboutComponent },
  { path: 'careers', component: CareersComponent },
  { path: 'contact', component: ContactComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];