import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipement } from '../models/equipement';
import KeycloakService from '../../../../host-app/src/app/shared/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class EquipementService {
  private apiUrl = 'http://localhost:8100/Equipements';

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.keycloakService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEquipements(page: number = 0, size: number = 5): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}?page=${page}&size=${size}`;
    return this.http.get<any>(url, { headers });
  }

  getEquipementsBySalleId(salleId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${salleId}`, { headers });
  }

  getEquipementById(id: number): Observable<Equipement> {
    const headers = this.getAuthHeaders();
    return this.http.get<Equipement>(`${this.apiUrl}/${id}`, { headers });
  }

  createEquipement(equipement: Equipement): Observable<Equipement> {
    const headers = this.getAuthHeaders();
    return this.http.post<Equipement>(this.apiUrl, equipement, { headers });
  }

  updateEquipement(id: number, equipement: Equipement): Observable<Equipement> {
    const headers = this.getAuthHeaders();
    return this.http.put<Equipement>(`${this.apiUrl}/${id}`, equipement, { headers });
  }

  deleteEquipement(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
