import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../task.service';
import { InputTextModule } from 'primeng/inputtext';
import { Task } from '../../model/Task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,ButtonModule,DialogModule,FormsModule,InputTextModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaskListComponent implements OnInit{
  tasks: Task[] = [];
  @Output() taskSelected = new EventEmitter<Task>();
  displayDetailsDialog: boolean = false; // Contrôle l'affichage du dialogue
  displayEditDialog: boolean = false; // For edit dialog
  selectedTask: Task | null = null; // Contient le projet sélectionné
  editableTask: Task | null = null; // For editing

  constructor(private taskService: TaskService) {}
  ngOnInit(): void {
    this.loadTasks();
    console.log(this.loadTasks());
    
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      console.log("sss");
    });
  }

  deleteTask(id: string): void {
    if (!id) {
      console.error('Task ID is undefined or null.');
      return;
    }
    console.log('Deleting task with id:', id);
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task._id !== id);
        console.log(`Task with id ${id} deleted successfully.`);
      },
      error: (err) => {
        console.error(`Failed to delete task with id ${id}:`, err);
      },
    });
  }

  viewTaskDetails(task: Task): void {
    this.selectedTask = task;
    this.displayDetailsDialog = true;
  }

  editTask(task: Task): void {
    this.editableTask = { ...task };
    this.displayEditDialog = true;
  }

  saveTask(editForm: any): void {
    if (!this.editableTask) {
      console.error('No task to save.');
      return;
    }

    this.taskService.updateTask(this.editableTask._id!, this.editableTask).subscribe({
      next: (updatedTask: Task) => {
        const index = this.tasks.findIndex((p) => p._id === updatedTask._id);
        if (index > -1) {
          this.tasks[index] = updatedTask;
        }
        console.log('Task updated:', updatedTask);
        this.displayEditDialog = false;
      },
      error: (err) => {
        console.error('Failed to update task:', err);
      },
    });
  }
}