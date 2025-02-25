import { Injectable } from '@angular/core';
import io, { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() {
    this.socket = io('http://localhost:5050', { // Or just io({ path: '/socket.io' }) if on the same host
      path: '/socket.io', // Match the path on the server
      transports: ['polling'], // Explicitly use polling
      secure: false // Only for development; set to true in production with HTTPS
  });
}  

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  receiveMessage(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('message', (data: string) => {
        observer.next(data);
      });
    });
  }
  getMessages(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('message', (message: string | undefined) => {
        observer.next(message);
      });
    });
  }
}
