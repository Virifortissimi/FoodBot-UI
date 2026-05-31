import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
        return true;
    }

    const token = await authService.ensureValidToken();
    if (token) {
        return true;
    }

    return router.createUrlTree(['/auth/login'], {
        queryParams: { redirect: state.url }
    });
};
