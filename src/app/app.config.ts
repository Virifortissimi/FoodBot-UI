import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthService } from './core/services/auth.service';
import { DeviceModeService } from './core/services/device-mode.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AuthService],
      useFactory: (authService: AuthService) => () => authService.initialize()
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [DeviceModeService],
      useFactory: (deviceModeService: DeviceModeService) => () => deviceModeService.initialize()
    },
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }), provideClientHydration()
]
};
