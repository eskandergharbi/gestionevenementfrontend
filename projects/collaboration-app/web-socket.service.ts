import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { KeycloakService } from '../host-app/src/app/shared/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private messageSubject = new BehaviorSubject<any>(null);
  public messages$ = this.messageSubject.asObservable();

  constructor(  private keycloakService: KeycloakService ) {
    const token = this.keycloakService.getToken(); // récupère le token JWT
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8121/chat'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      debug: (str) => console.log(str)
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/topic/public', (message: IMessage) => {
        this.messageSubject.next(JSON.parse(message.body));
      });
    };
  }

  connect(username: string): void {
    this.stompClient.activate();
    setTimeout(() => {
      this.stompClient.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({ sender: username, type: 'JOIN' })
      });
    }, 1000); // petit délai pour éviter que le publish parte avant la connexion
  }

  sendMessage(content: string, sender: string): void {
    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ sender, content, type: 'CHAT' })
    });
  }

  disconnect(): void {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }
}
