import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../../../web-socket.service';
import { Subscription } from 'rxjs';
import { KeycloakService } from '../../../../../host-app/src/app/shared/keycloak.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  username = '';
  connected = false;
  message = '';
  messages: any[] = [];

  private sub!: Subscription;

  constructor(private wsService: WebSocketService ) {}
     roles: string[] = [];
 
  ngOnInit(): void {
    this.sub = this.wsService.messages$.subscribe(msg => {
      if (msg) {
        this.messages.push(msg);
      }
    });
  }

  connect(): void {
    if (this.username) {
      this.wsService.connect(this.username);
      this.connected = true;
    }
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.wsService.sendMessage(this.message, this.username);
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.wsService.disconnect();
  }
}

