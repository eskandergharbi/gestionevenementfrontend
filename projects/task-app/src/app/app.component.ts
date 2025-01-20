import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskService } from './task.service';
import { Task, User } from './models/task';
import { Project } from './models/project.model';
import { UserService } from './services/user.service';
import {DropdownModule} from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  projects: Project[] = []; // Array to hold projects
  projectId: string = ''; // Selected project ID
  tasks: Task[] = [];
  newTask: Task = { title: '', description: '', assignedTo: '', projectId: '', status: 'not started', priority: 'medium' }; // Initialize projectId as an empty string
  editingTask= null;

  currentProjectId = '';
  users: User[] = [];

  constructor(private taskService: TaskService,private userService:UserService,private messageService:MessageService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();
  }
  loadTasks(): void {
    this.taskService.getTasks(this.projectId).subscribe((data: any[]) => {
      this.tasks = data.map((item) => ({
        id: item.id, // Ensure this matches your Task model
        title: item.title,
        description: item.description,
        assignedTo: item.assignedTo || '', // Default to an empty string if not present
        projectId: item.projectId , // Use currentProjectId if not present
        status: item.status || 'not started', // Default value if absent
        priority: item.priority || 'medium', // Default value if absent
      }));
    });
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data; // Assign the fetched users to the users array
      },
      error: (error) => {
        console.error('Error fetching users', error); // Handle error
      },
      complete: () => {
        console.log('User  fetching completed'); // Optional: Handle completion
      }
    });
  }

  createTask(): void {
    this.taskService.createTask(this.newTask).subscribe((task: Task) => {
      this.tasks.push(task); // Ajoute la nouvelle tâche à la liste
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task created successfully!' }); // Show success message
      this.toastr.success('Task created and notification sent!'); // Notify user
      this.newTask = {
        id: '', // Optional, can be left out if not needed
        title: '',
        description: '',
        assignedTo: '', // Reset assignedTo if needed
        projectId: this.currentProjectId, // Keep the projectId for the next task
        status: 'not started', // Default status
        priority: 'medium' // Default priority
      };    });
  }
  


  updateTask(task: Task): void {
    this.taskService.updateTask(task.id!, task).subscribe(() => {
      this.loadTasks(); // Reload tasks after update
      this.toastr.info('Task updated successfully!'); // Show info notification
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks(); // Reload tasks after deletion
      this.toastr.warning('Task deleted successfully!'); // Show warning notification
    });
  }
 }
