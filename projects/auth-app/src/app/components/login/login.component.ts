import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [HttpClientModule ,FormsModule,CommonModule,ButtonModule,InputTextModule],
  templateUrl: './login.component.html',
  standalone: true,  // Add this line
  styleUrl: './login.component.css'
})
export class LoginComponent{
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Store JWT in local storage
        this.router.navigate(['/auth/dashboard']); // Redirect to dashboard or home
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials'; // Handle error
      }
    });
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
