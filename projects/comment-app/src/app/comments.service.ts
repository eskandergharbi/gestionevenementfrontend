import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommentsService {
    private baseUrl = 'http://localhost:3002/api/comments';

    constructor(private http: HttpClient) {}

    getCommentsByTask(taskId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/task/${taskId}`);
    }

    createComment(comment: any): Observable<any> {
        return this.http.post(this.baseUrl, comment);
    }

    deleteComment(commentId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${commentId}`);
    }
}
