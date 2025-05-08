import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salle } from '../models/Salle';
import KeycloakService from '../../../../host-app/src/app/shared/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class SalleService {
  private apiUrl = 'http://localhost:8100/Salles';

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService  // Inject KeycloakService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.keycloakService.getToken(); 
    console.log(token);
     // Get token from Keycloak service
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSalles(page: number = 0, size: number = 5): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&size=${size}`;
    const headers = this.getAuthHeaders();
    return this.http.get<any>(url, { headers });
  }

  getSalleById(id: number): Observable<Salle> {
    const headers = this.getAuthHeaders();
    return this.http.get<Salle>(`${this.apiUrl}/${id}`, { headers });
  }

  createSalle(salle: Salle): Observable<Salle> {
    const headers = this.getAuthHeaders();
    return this.http.post<Salle>(this.apiUrl, salle, { headers });
  }

  updateSalle(id: number, salle: Salle): Observable<Salle> {
    const headers = this.getAuthHeaders();
    return this.http.put<Salle>(`${this.apiUrl}/${id}`, salle, { headers });
  }

  deleteSalle(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
