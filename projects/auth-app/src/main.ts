import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes'; // tes routes
import {  authInterceptorFn } from './app/interceptors/auth.interceptor';
import { KeycloakService } from './app/services/keycloak.service';
import { APP_INITIALIZER } from '@angular/core';

export function initializeKeycloak(keycloakService: KeycloakService) {
  return () => keycloakService.init();
}

bootstrapApplication(AppComponent, {
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true
    },
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorFn])),
    importProvidersFrom(BrowserAnimationsModule)
  ]
});
