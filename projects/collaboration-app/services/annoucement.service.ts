import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Announcement } from '../models/annoucement';
import { KeycloakService } from '../../host-app/src/app/shared/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:8121/api/announcements';

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.keycloakService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  postAnnouncement(announcement: Announcement): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, announcement, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAll(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateAnnouncement(id: number, announcement: Announcement): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, announcement, {
      headers: this.getAuthHeaders()
    });
  }
}
