import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommentsService {
    private baseUrl = 'http://localhost:3007/api/comments';

    constructor(private http: HttpClient) {}

    getCommentsByTask(taskId: string): Observable<any> {
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.baseUrl}/task/${taskId}`, { headers });
    }

    createComment(comment: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("comment",token);
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            return this.http.post(this.baseUrl, comment, { headers });
    }

    deleteComment(commentId: string): Observable<any> {
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete(`${this.baseUrl}/${commentId}`, { headers });
    }
}
