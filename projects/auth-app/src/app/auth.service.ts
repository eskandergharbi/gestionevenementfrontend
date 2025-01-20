
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users'; // Your API URL

  constructor(private http: HttpClient) {}

  register(firstName: string, lastName: string, email: string, username: string, password: string, role: string,dateOfBirth:Date): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { firstName, lastName, email,username, password, role,dateOfBirth });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
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
}