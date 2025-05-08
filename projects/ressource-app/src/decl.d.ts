declare module 'auth/KeycloakService' {
    import { KeycloakService } from 'auth-app-path/src/app/services/keycloak.service'; // <-- temporaire
    export = KeycloakService;
  }
  
  declare module 'auth/AuthInterceptor' {
    export const authInterceptorFn: any;
  }
  
  declare module 'auth/RoleGuard' {
    export const RoleGuard: any;
  }
  