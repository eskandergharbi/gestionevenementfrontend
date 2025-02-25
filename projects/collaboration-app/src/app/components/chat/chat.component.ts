import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../../chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports:[CommonModule,FormsModule],
  standalone:true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  newMessage: string = '';

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.receiveMessage().subscribe((message) => {
      this.messages.push(message);
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.socketService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }
}
