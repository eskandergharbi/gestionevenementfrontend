import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../../../auth-app/src/app/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  providers:[AuthService],
  standalone: true,
  imports: [CardModule, RouterModule, CommonModule, SidebarModule, ButtonModule, MenubarModule]
})
export class MenuComponent implements OnInit {

  visibleSidebar: boolean = false;
  menuItems: any[] = [];
  userRole: string | null = null; 
  userlogged:Boolean | undefined;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Assuming AuthService provides the user role correctly
    this.userRole = this.authService.getUserRole(); // Fetch user role
    this.setMenuItems(); 
    this.userlogged=this.authService.isLoggedIn();
  }

  setMenuItems() {
    // Common menu for all users
    this.menuItems = [
      { label: 'Home', icon: 'pi pi-home', command: () => this.navigateTo('/home') },
      { label: 'About', icon: 'pi pi-info-circle', command: () => this.navigateTo('/about') },
      { label: 'Contact', icon: 'pi pi-envelope', command: () => this.navigateTo('/contact') },
    ];

    // Admin-specific menu items
    if (this.userRole === 'admin') {
      this.menuItems.push(
        { label: 'Chat', icon: 'pi pi-comments',command: () => this.navigateTo('/upload')  },
        { label: 'Reports', icon: 'pi pi-chart-line', command: () => this.navigateTo('/home')},
        { label: 'Tasks', icon: 'pi pi-check-square', command: () => this.navigateTo('/task') },
        { label: 'comments', icon: 'pi pi-folder', command: () => this.navigateTo('/comment') },
        { label: 'Members', icon: 'pi pi-folder', command: () => this.navigateTo('/create') },
        { label: 'upload', icon: 'pi pi-folder', command: () => this.navigateTo('/upload') },
        { label: 'reports', icon: 'pi pi-folder', command: () => this.navigateTo('/dashboards') },
        { label: 'projects', icon: 'pi pi-folder', command: () => this.navigateTo('/project') }

      );
    }
    // Developer-specific menu items
    else if (this.userRole === 'developer') {
      this.menuItems.push(
        { label: 'Tasks', icon: 'pi pi-check-square', command: () => this.loadMicrofrontend('task-app') }
      );
    }
    // Chef de projet-specific menu items
    else if (this.userRole === 'chefdeprojet') {
      this.menuItems.push(
        { label: 'Tasks', icon: 'pi pi-check-square', command: () => this.loadMicrofrontend('task-app') }
      );
    }
  }

  toggleSidebar() {
    this.visibleSidebar = !this.visibleSidebar;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  redirectToLogin() {
    console.log('Redirecting to /auth/login');
    this.router.navigate(['login']);
  }
  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
    this.userlogged = false; // Update the userlogged status

    // Optionally redirect to the login page
    this.router.navigate(['/login']); // Adjust the route as necessary
  }
  loadMicrofrontend(appName: string) {
    // Ensure the app names match the route configuration of each microfrontend
    this.router.navigateByUrl(`/${appName}`);
    this.visibleSidebar = false;
  }
}
