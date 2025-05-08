// main.ts in host application
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import KeycloakService from './app/shared/keycloak.service';

const keycloakService = new KeycloakService();

keycloakService.init().then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      { provide: KeycloakService, useValue: keycloakService }
    ]
  }).catch(err => console.error(err));
});