import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelloApiService {
  private baseUrl = 'http://localhost:8181/api';

  constructor(private http: HttpClient) {}

  getHello(): Observable<string> {
    return this.http.get(`${this.baseUrl}/hello`, { responseType: 'text' });
  }

  getUser(): Observable<string> {
    return this.http.get(`${this.baseUrl}/user`, { responseType: 'text' });
  }

  getAdmin(): Observable<string> {
    return this.http.get(`${this.baseUrl}/admin`, { responseType: 'text' });
  }
}
