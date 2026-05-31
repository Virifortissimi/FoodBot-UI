import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'fb-theme-preference';
    theme = signal<Theme>('light');

    constructor(@Inject(PLATFORM_ID) private platformId: object) {
        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
            if (savedTheme) {
                this.setTheme(savedTheme);
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.setTheme('dark');
            } else {
                this.setTheme('light');
            }
        }
    }

    toggleTheme() {
        this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
    }

    setTheme(theme: Theme) {
        this.theme.set(theme);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.THEME_KEY, theme);
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }
}
