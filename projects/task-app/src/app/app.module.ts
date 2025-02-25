import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule
import { AppRoutingModule } from './app.routes';
import { HttpClient } from '@angular/common/http';
import { TaskService } from './task.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [TaskService,HttpClient],

})
export class AppModule {}