import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboards.component.html',
  standalone: true, 
  styleUrl: './dashboards.component.css'
})
export class DashboardsComponent {
  userRole: string | null = '';

  constructor(private authService: AuthService) {
    this.userRole = this.authService.getUserRole(); // Get user role
  }

  logout() {
    this.authService.logout(); // Call logout method
  }
}

