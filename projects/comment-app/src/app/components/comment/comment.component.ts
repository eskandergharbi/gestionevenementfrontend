import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommentsService } from '../../comments.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule,ButtonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[MessageService]

})
export class CommentComponent {
  commentForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private commentsService: CommentsService,
      private messageService: MessageService
  ) {
      this.commentForm = this.fb.group({
          taskId: ['exampleTaskId', Validators.required], // Replace dynamically
          userId: ['exampleUserId', Validators.required], // Replace dynamically
          text: ['', Validators.required],
      });
  }

  onSubmit(): void {
      if (this.commentForm.valid) {
          this.commentsService.createComment(this.commentForm.value).subscribe({
              next: () => {
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Created',
                      detail: 'Comment created successfully',
                  });
                  this.commentForm.reset();
              },
              error: (err) => console.error(err),
          });
      }
  }
}
