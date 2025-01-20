import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from './models/chat-message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3001/api/chat'; // Adjust the URL as needed

  constructor(private http: HttpClient) { }

  // Send a message
  sendMessage(projectId: string, message: string): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(this.apiUrl, { projectId, message });
  }

  // Get messages for a project
  getMessages(projectId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/${projectId}`);
  }
}