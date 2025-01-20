import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private baseUrl = 'http://localhost:3003/api/members';

  constructor(private http: HttpClient) {}

  getAllMembers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getMemberById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createMember(member: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, member);
  }

  updateMember(id: string, member: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, member);
  }

  deleteMember(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
