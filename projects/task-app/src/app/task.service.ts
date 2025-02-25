import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './model/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3010/api/tasks';

  constructor(private http: HttpClient) {}

  getTasksByProjectId(projectId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Task[]>(`${this.apiUrl}/${projectId}`, { headers });
  }
  getAllTasks(): Observable<Task[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Task[]>(`${this.apiUrl}`, { headers });
  }
  createTask(task: Task): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Task>(this.apiUrl, task, { headers });
  }
  
  updateTask(taskId: string, task: Task): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}`, task, { headers });
  }

  deleteTask(id: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}