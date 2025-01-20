import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommentComponent } from './components/comment/comment.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommentComponent,CommentListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers:[MessageService]
  
})
export class AppComponent {
  title = 'comment-app';
}
