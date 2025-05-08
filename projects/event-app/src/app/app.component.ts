import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventListComponent } from './components/event-list/event-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EventListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers:[MessageService]
  
})
export class AppComponent {
  title = 'comment-app';
}
