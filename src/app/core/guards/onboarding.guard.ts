import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const onboardingGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
        return true;
    }

    const user = authService.user();

    // If not logged in, allow them to proceed (AuthGuard will handle protection if needed elsewhere)
    if (!user) return true;

    // If onboarding is NOT completed, they MUST go to /onboarding
    if (!user.onboardingCompleted) {
        // Prevent infinite redirect if they are already heading to /onboarding
        if (state.url === '/onboarding') return true;

        return router.parseUrl('/onboarding');
    }

    // If onboarding IS completed and they try to go to /onboarding, send them to the dashboard
    if (user.onboardingCompleted && state.url === '/onboarding') {
        return router.parseUrl('/dashboard');
    }

    // Logged-in users should not land on the public home page.
    if (user.onboardingCompleted && (state.url === '/' || state.url.startsWith('/#'))) {
        return router.parseUrl('/dashboard');
    }

    return true;
};
