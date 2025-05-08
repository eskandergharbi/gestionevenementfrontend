import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import KeycloakService from '../../../../host-app/src/app/shared/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8100/reservations';

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.keycloakService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getReservations(page: number = 0, size: number = 5): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}?page=${page}&size=${size}`;
    return this.http.get<any>(url, { headers });
  }

  getReservationById(id: number): Observable<Reservation> {
    const headers = this.getAuthHeaders();
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`, { headers });
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    const headers = this.getAuthHeaders();
    return this.http.post<Reservation>(this.apiUrl, reservation, { headers });
  }

  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    const headers = this.getAuthHeaders();
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation, { headers });
  }

  deleteReservation(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getEquipements(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>('http://localhost:8100/Equipements', { headers });
  }
}
