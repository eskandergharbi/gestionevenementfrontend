import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',           // Keycloak URL
      realm: 'book-social-network',                    // Replace with your realm name
      clientId: 'bsn'              // Replace with your client ID
    });
  }

  init(): Promise<boolean> {
    return this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    }).then(authenticated => {
      console.log('Keycloak initialized', authenticated);
      return authenticated;
    }).catch(error => {
      console.error('Keycloak init failed', error);
      return false;
    });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  logout(): void {
    this.keycloak.logout();
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.token;
  }
  getUserRoles(): string[] {
    const tokenParsed = this.keycloak.tokenParsed;
    if (!tokenParsed) return [];
  
    const realmRoles: string[] = tokenParsed['realm_access']?.roles || [];
    const clientId = this.keycloak.clientId!;
    const clientRoles: string[] = tokenParsed['resource_access']?.[clientId]?.roles || [];
      
    return [...realmRoles, ...clientRoles];
  }
  
}
export default KeycloakService;
