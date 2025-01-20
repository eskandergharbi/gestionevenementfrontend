import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  standalone: true, 
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userRole: string | null = '';

  constructor(private authService: AuthService) {
    this.userRole = this.authService.getUserRole(); // Get user role
  }

  logout() {
    this.authService.logout(); // Call logout method
  }
}

