import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaborationRoutingModule } from './app.routes'; // Importer le module de routage
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AppComponent } from './app.component';
import { ProjectModule } from 'microfrontend-a/SharedModule';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ProjectModule,
    CommonModule,
    CollaborationRoutingModule,
    FormsModule // Ajoutez le module de routage ici
  ],
  providers: [ChatService],

})
export class CollaborationModule {}