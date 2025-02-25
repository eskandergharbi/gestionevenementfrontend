import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommentsService } from '../../comments.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Task } from '../../../../../task-app/src/app/model/Task';
import { Member } from '../../../../../member-app/src/app/model/Member';
import { TaskService } from '../../../../../task-app/src/app/task.service';
import { MemberService } from '../../../../../member-app/src/member.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule,ButtonModule,DropdownModule ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[MessageService]

})
export class CommentComponent {
  commentForm: FormGroup;
 taskOptions:Task[]=[];
  userOptions:Member[]=[];
  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService,
    private messageService: MessageService,
    private taskService:TaskService,
    private memberService:MemberService
) {
    this.commentForm = this.fb.group({
        taskId: ['exampleTaskId', Validators.required], // Replace dynamically
        userId: ['exampleUserId', Validators.required], // Replace dynamically
        text: ['', Validators.required],
    });
}

  ngOnInit(): void {
this.loadMembers();
this.loadTasks();

  }
  loadTasks(): void {
    this.taskService.getAllTasks().subscribe((projects: Task[]) => {
      this.taskOptions = projects; // Assign the actual array of projects
      console.log(this.taskOptions);
      
    });
  }
  loadMembers(): void {
    this.memberService.getAllMembers().subscribe((data:any) => (this.userOptions = data));
    console.log(this.userOptions);
    
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
  onCancel() {
    // Implement your cancel logic here
    console.log("Cancel button clicked");

    // Example 1: Reset the form
    this.commentForm.reset();}
}
