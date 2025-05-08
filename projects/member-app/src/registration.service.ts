import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from '../../host-app/src/app/shared/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:8088/api/registrations';

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.keycloakService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  registerUser(eventId: string, userEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, null, {
      params: { eventId, userEmail },
      headers: this.getAuthHeaders()
    });
  }

  cancelRegistration(eventId: string, userEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancel`, null, {
      params: { eventId, userEmail },
      headers: this.getAuthHeaders()
    });
  }
}
