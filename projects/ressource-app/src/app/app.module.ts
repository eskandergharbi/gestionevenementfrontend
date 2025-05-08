import {   NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import  KeycloakService  from 'auth/KeycloakService'; // federation import

export function initializeKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init();
}

@NgModule({
  declarations: [],
  imports: [BrowserModule],
  providers: [
    KeycloakService
  ],
  bootstrap: []
})
export class AppModule {}
