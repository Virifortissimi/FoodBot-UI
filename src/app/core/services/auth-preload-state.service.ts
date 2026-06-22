import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthPreloadStateService {
    readonly enabled = signal(false);

    enable(): void {
        this.enabled.set(true);
    }

    disable(): void {
        this.enabled.set(false);
    }
}
