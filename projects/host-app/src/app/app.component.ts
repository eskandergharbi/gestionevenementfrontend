import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import KeycloakService from './shared/keycloak.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {
  constructor(private authService: KeycloakService) {}

  ngOnInit(): void {
    this.authService.init().then((authenticated: any) => {
      if (authenticated) {
        console.log('User  is authenticated');
      } else {
        console.log('User  is not authenticated');
      }
    });
  }}