import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskService } from './task.service';
import {DropdownModule} from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { MenuComponent } from './components/menu/menu.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MenuComponent,TaskListComponent,TaskFormComponent],
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}