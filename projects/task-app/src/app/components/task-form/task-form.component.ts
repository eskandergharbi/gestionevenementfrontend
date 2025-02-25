import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Task } from '../../model/Task';
import { TaskService } from '../../task.service';
import { MemberService } from '../../../../../member-app/src/member.service';
import { Project } from '../../../../../project-app/src/app/models/project';
import { ProjectService } from '../../../../../project-app/src/app/services/project.service';
import { Member } from '../../../../../member-app/src/app/model/Member';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../auth-app/src/app/auth.service';

@Component({
  selector: 'app-Task-form',
  standalone:true,
  imports:[CommonModule,FormsModule,DropdownModule,ButtonModule,InputTextModule,TableModule],
  templateUrl: './Task-form.component.html',
  styleUrls: ['./Task-form.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaskFormComponent implements OnInit{
  newTask: Task = {
    title: '',
    description: '',
    assignedTo: '',
    project: '',
    status: 'not started',
    priority: 'low'
  };
  userRole: string | null = '';

  @Output() TaskCreated = new EventEmitter<Task>();
  projectOptions:Project[]=[];
  userOptions:Member[]=[];
  constructor(private taskService: TaskService,private projectService: ProjectService,private memberService: MemberService,private router:Router,private authService: AuthService) {}
  ngOnInit(): void {
this.loadMembers();
this.loadProjects();
this.userRole = this.authService.getUserRole();

  }
  loadProjects(): void {
    this.projectService.getProjects().subscribe((projects: Project[]) => {
      this.projectOptions = projects; // Assign the actual array of projects
      console.log(this.projectOptions);
      
    });
  }
  loadMembers(): void {
    this.memberService.getAllMembers().subscribe((data:any) => (this.userOptions = data));
    console.log(this.userOptions);
    
  }
createTask(): void {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token manquant');
    this.router.navigate(['/login']);
    return;
  }
  this.taskService.createTask(this.newTask).subscribe({
    next: (task: Task) => {
      this.resetForm();
      this.router.navigate(['/list']);
      console.log('Task created successfully:', task);
    },
    error: (err) => console.error('Error creating task:', err),
  });
}


  resetForm(): void {
    this.newTask =  {
      title: '',
      description: '',
      assignedTo: '',
      project: '',
      status: 'not started',
      priority: 'low'
    };
  }
}