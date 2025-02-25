import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../../auth-app/src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:3006/api/reports';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProjectStatistics(): Observable<any> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        if (!token) {
          console.error('❌ Aucun token trouvé.');
          return throwError(() => new Error('Token manquant.'));
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/projects/statistics`, { headers });
      }),
      catchError(error => {
        console.error('❌ Erreur lors de la récupération des stats projets:', error);
        return throwError(() => new Error('Erreur API.'));
      })
    );
  }

  getTaskStatistics(): Observable<any> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        if (!token) {
          console.error('❌ Aucun token trouvé.');
          return throwError(() => new Error('Token manquant.'));
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/tasks/statistics`, { headers });
      }),
      catchError(error => {
        console.error('❌ Erreur lors de la récupération des stats tâches:', error);
        return throwError(() => new Error('Erreur API.'));
      })
    );
  }
}
