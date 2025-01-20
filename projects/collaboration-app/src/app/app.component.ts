import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  messages: any[] = [];
  newMessage: string = '';
  currentProjectId: any = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
  }

  loadMessages(projectId: string): void {
    this.currentProjectId = projectId;
    this.chatService.getMessages(this.currentProjectId).subscribe((data) => {
      this.messages = data;
    });
  }

  sendMessage(): void {
    this.chatService.sendMessage(this.currentProjectId, this.newMessage).subscribe((message) => {
      this.messages.push(message);
      this.newMessage = ''; // Clear input
    });
  }
  }
