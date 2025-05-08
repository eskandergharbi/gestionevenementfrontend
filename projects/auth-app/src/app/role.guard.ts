import { inject } from '@angular/core';
import { KeycloakService } from './services/keycloak.service';
import { CanActivateFn } from '@angular/router';
export const RoleGuard = (expectedRoles: string[]): CanActivateFn => {
  return () => {
    const keycloakService = inject(KeycloakService);
    const userRoles = keycloakService.getUserRoles();
    return expectedRoles.some(role => userRoles.includes(role));
  };
};
