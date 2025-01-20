import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommentsService } from '../../comments.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,ButtonModule],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers:[MessageService]

})
export class CommentListComponent implements OnInit {
  comments: any[] = [];
  taskId = 'exampleTaskId'; // Replace this dynamically

  constructor(
      private commentsService: CommentsService,
      private messageService: MessageService
  ) {}

  ngOnInit(): void {
      this.loadComments();
  }

  loadComments(): void {
      this.commentsService.getCommentsByTask(this.taskId).subscribe({
          next: (data) => (this.comments = data),
          error: (err) => console.error(err),
      });
  }

  deleteComment(commentId: string): void {
      this.commentsService.deleteComment(commentId).subscribe({
          next: () => {
              this.comments = this.comments.filter((c) => c._id !== commentId);
              this.messageService.add({
                  severity: 'success',
                  summary: 'Deleted',
                  detail: 'Comment deleted successfully',
              });
          },
          error: (err) => console.error(err),
      });
  }

}
