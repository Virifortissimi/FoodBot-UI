import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const AUTH_ENDPOINT_PATTERN = /\/api\/v1\/auth\/(public-key|login|register|exchange|refresh|logout)(\/|$)/i;
const RETRY_HEADER = 'X-FoodBot-Auth-Retry';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const isAuthRequest = AUTH_ENDPOINT_PATTERN.test(req.url);

    if (isAuthRequest) {
        return next(req.clone({ withCredentials: true })).pipe(
            catchError((error: HttpErrorResponse) => throwError(() => error))
        );
    }

    return from(authService.ensureValidToken()).pipe(
        switchMap(token => {
            const hasAuthorizationHeader = req.headers.has('Authorization');
            let authReq = req;

            if (token && !hasAuthorizationHeader && !isAuthRequest) {
                authReq = authReq.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            return next(authReq).pipe(
                catchError((error: HttpErrorResponse) => {
                    const alreadyRetried = authReq.headers.has(RETRY_HEADER);
                    if (error.status !== 401 || isAuthRequest || alreadyRetried || isExternalServiceAuthFailure(error)) {
                        return throwError(() => error);
                    }

                    return from(authService.refreshSession()).pipe(
                        switchMap(refreshedToken => {
                            if (!refreshedToken) {
                                void authService.signOut();
                                return throwError(() => error);
                            }

                            const retryReq = authReq.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${refreshedToken}`,
                                    [RETRY_HEADER]: '1'
                                }
                            });

                            return next(retryReq);
                        }),
                        catchError(refreshError => {
                            void authService.signOut();
                            return throwError(() => refreshError);
                        })
                    );
                })
            );
        })
    );
};

function isExternalServiceAuthFailure(error: HttpErrorResponse): boolean {
    const message = [
        error.error?.errors?.[0],
        error.error?.message,
        error.message
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    return message.includes('github models')
        || message.includes('configured github models pat')
        || message.includes('external service');
}
