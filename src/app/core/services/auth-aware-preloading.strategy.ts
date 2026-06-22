import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthPreloadStateService } from './auth-preload-state.service';

@Injectable({
    providedIn: 'root'
})
export class AuthAwarePreloadingStrategy implements PreloadingStrategy {
    constructor(private authPreloadState: AuthPreloadStateService) { }

    preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
        if (!route.data?.['preload']) {
            return of(null);
        }

        if (!route.data?.['preloadAfterAuth']) {
            return load();
        }

        return this.authPreloadState.enabled() ? load() : of(null);
    }
}
