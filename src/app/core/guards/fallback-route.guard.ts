import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const fallbackRouteGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    const toastService = inject(ToastService);

    if (isPlatformServer(platformId)) {
        return router.parseUrl('/');
    }

    const token = await authService.ensureValidToken();
    toastService.warning('That route does not exist. Redirecting you now.');
    return router.parseUrl(token ? '/dashboard' : '/');
};
