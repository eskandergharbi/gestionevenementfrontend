
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3100/api/users'; // Your API URL
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  register(firstName: string, lastName: string, email: string, username: string, password: string, role: string,dateOfBirth:Date): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { firstName, lastName, email,username, password, role,dateOfBirth });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        console.log('Login response:', response.token);
        if (response && response.token) {
          window.localStorage.setItem('token', response.token);
          window.dispatchEvent(new Event('tokenUpdated'));
                    console.log("aaa",localStorage.getItem('token'));

        }
      })
    );
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      return payload.role; // Return user role
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove token on logout
  }

  setToken(token: string) {
    localStorage.setItem('token', token); // Stocker dans le localStorage
    this.tokenSubject.next(token); // Mettre à jour le flux du token
  }

  getToken(): Observable<string | null> {
    return this.tokenSubject.asObservable(); // Permet aux autres de "s'abonner" aux changements du token
  }

  getCurrentToken(): string | null {
    return this.tokenSubject.value; // Récupérer le token actuel
  }
}