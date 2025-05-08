import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import keycloakService, { KeycloakService } from '../../host-app/src/app/shared/keycloak.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app/app.routes';
import Aura from '@primeng/themes/aura'; // add this
import { MFE1_ROUTES } from './app/components/event-routing.module';


  bootstrapApplication(AppComponent, {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideAnimationsAsync(),  // add this
      providePrimeNG({           // add this
        theme: {                 // add this
          preset: Aura,          // add this
        },                       // add this
      }),                
      provideAnimations(),
      provideHttpClient(),
      importProvidersFrom(RouterModule.forRoot(MFE1_ROUTES)),
      { provide: KeycloakService, useValue: keycloakService }
    ]
  }).catch(err => console.error(err));
