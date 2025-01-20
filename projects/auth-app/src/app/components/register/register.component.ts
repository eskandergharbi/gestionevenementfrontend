import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

interface Role {
  name: string,
  code: string
}
@Component({
  selector: 'app-register',
  imports: [HttpClientModule ,FormsModule,CommonModule,DropdownModule,InputTextModule,ButtonModule],
  templateUrl: './register.component.html',
  standalone: true,  // Add this line
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  userName:string ='';
  password: string = '';
  role: string = 'developer'; // Default role
  dateOfBirth: Date = new Date(); // Initialize with the current date
 errorMessage: string = '';

 selectedRoleCode: string ='';
  constructor(private authService: AuthService, private router: Router) {}
  roles: Role[]  = [
    { name: 'Developer', code: 'developer' },
    { name: 'Project Manager', code: 'project_manager' },
    { name: 'Admin', code: 'admin' },
  ];
  register() {
    this.authService.register(this.firstName, this.lastName, this.email,this.userName, this.password, this.selectedRoleCode,this.dateOfBirth).subscribe({
      next: () => {
        this.router.navigate(['/login']); // Redirect to login after successful registration
      },
      error: (error) => {
        this.errorMessage = 'Registration failed'; // Handle error
      }
    });
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
