import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskRoutingModule } from './app.routes'; // Importer le module de routage
import { TaskService } from './task.service';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    TaskRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // Ajoutez le module de routage ici
  ],
  providers: [MessageService,TaskService,UserService],

})
export class TaskModule {}