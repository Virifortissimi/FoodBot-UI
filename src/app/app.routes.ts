import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { onboardingGuard } from './core/guards/onboarding.guard';
import { authGuard } from './core/guards/auth.guard';
import { fallbackRouteGuard } from './core/guards/fallback-route.guard';

export const routes: Routes = [
    { path: '', component: HomePageComponent, canActivate: [onboardingGuard] },
    {
        path: 'onboarding',
        loadComponent: () => import('./features/auth/pages/onboarding/onboarding-page.component').then(m => m.OnboardingPageComponent),
        canActivate: [authGuard, onboardingGuard]
    },
    { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
    {
        path: 'meal-planner',
        loadChildren: () => import('./features/meal-planner/meal-planner.module').then(m => m.MealPlannerModule),
        canActivate: [authGuard, onboardingGuard]
    },
    { path: 'recipes', loadComponent: () => import('./features/recipes/components/recipe-list/recipe-list.component').then(m => m.RecipeListComponent) },
    { path: 'recipes/:slug', loadComponent: () => import('./features/recipes/pages/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent) },
    { path: 'recipe-chat', loadComponent: () => import('./features/recipe-chat/pages/recipe-chat-page/recipe-chat-page.component').then(m => m.RecipeChatPageComponent), canActivate: [authGuard, onboardingGuard] },
    { path: 'pricing', loadChildren: () => import('./features/pricing/pricing.module').then(m => m.PricingModule) },
    {
        path: 'nutrition',
        loadChildren: () => import('./features/nutrition/nutrition.module').then(m => m.NutritionModule),
        canActivate: [authGuard, onboardingGuard]
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [authGuard, onboardingGuard]
    },
    {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [authGuard, onboardingGuard]
    },
    {
        path: 'shopping-list',
        loadChildren: () => import('./features/shopping-list/shopping-list.module').then(m => m.ShoppingListModule),
        canActivate: [authGuard, onboardingGuard]
    },
    { path: 'learn/courses', loadComponent: () => import('./features/learn/pages/course-list/course-list.component').then(m => m.CourseListComponent), canActivate: [authGuard, onboardingGuard] },
    { path: 'learn/courses/:slug', loadComponent: () => import('./features/learn/pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent), canActivate: [authGuard, onboardingGuard] },
    { path: 'learn/lessons/:slug', loadComponent: () => import('./features/learn/pages/lesson-detail/lesson-detail.component').then(m => m.LessonDetailComponent), canActivate: [authGuard, onboardingGuard] },
    { path: 'learn', loadComponent: () => import('./features/learn/pages/glossary-page/glossary-page.component').then(m => m.GlossaryPageComponent) },
    { path: 'api-docs', loadComponent: () => import('./features/developers/pages/api-docs-page/api-docs-page.component').then(m => m.ApiDocsPageComponent) },
    { path: 'about', loadComponent: () => import('./features/corporate/pages/about-page/about-page.component').then(m => m.AboutPageComponent) },
    { path: 'contact', loadComponent: () => import('./features/corporate/pages/contact-page/contact-page.component').then(m => m.ContactPageComponent) },
    { path: 'careers', loadComponent: () => import('./features/corporate/pages/careers-page/careers-page.component').then(m => m.CareersPageComponent) },
    { path: 'help', loadComponent: () => import('./features/corporate/pages/help-center/help-center.component').then(m => m.HelpCenterComponent) },
    { path: 'legal', loadComponent: () => import('./features/corporate/pages/legal-page/legal-page.component').then(m => m.LegalPageComponent) },
    { path: '**', canActivate: [fallbackRouteGuard], component: HomePageComponent }
];
