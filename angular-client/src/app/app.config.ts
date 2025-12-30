import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { isPlatformBrowser } from '@angular/common';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () => {
    // Only initialize Keycloak in the browser, not during SSR
    if (isPlatformBrowser(platformId)) {
      return keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'weather-shop',
          clientId: 'angular-client'
        },
        initOptions: {
          onLoad: 'check-sso',
          checkLoginIframe: false,
          enableLogging: true,
          flow: 'standard'
        }
      });
    }
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, PLATFORM_ID]
    }
  ]
};
