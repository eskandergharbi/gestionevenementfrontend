import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private baseUrl = 'http://localhost:3003/api/members';

  constructor(private http: HttpClient) {}

  getAllMembers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.baseUrl, { headers });
  }

  getMemberById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers });
  }

  createMember(member: any): Observable<any> {
        const token = localStorage.getItem('token');
        console.log("t",token);
        
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.baseUrl, member, { headers });
  }

  updateMember(id: string, member: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/${id}`, member, { headers });
  }

  deleteMember(id: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers });
  }
}
