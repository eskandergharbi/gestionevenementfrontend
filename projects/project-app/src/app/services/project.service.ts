import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'http://localhost:3012/api/projects'; // Adjust the URL as needed

  constructor(private http: HttpClient) { }

  // Create a new project
  createProject(project: Project): Observable<Project> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Project>(this.apiUrl, project, { headers });
  }

  // Get all projects
  getProjects(): Observable<Project[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Project[]>(this.apiUrl, { headers });
  }

  // Update a project
  updateProject(id: string, project: Project): Observable<Project> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project, { headers });
  }

  // Delete a project
  deleteProject(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  // Add a member to a project
  addMemberToProject(id: string, memberId: string): Observable<Project> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Project>(`${this.apiUrl}/${id}/members`, { memberId }, { headers });
  }}
