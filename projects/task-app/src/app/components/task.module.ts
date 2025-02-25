import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';

import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card'; // Import CardModule
import { MenuComponent } from './menu/menu.component';
import { TaskService } from '../task.service';
import { TaskRoutingModule } from './task-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    SidebarModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    TaskRoutingModule,
    TaskListComponent,
    TaskFormComponent,
    MenuComponent
  ],
  providers: [TaskService]// add it here


})
export class TaskModule { }