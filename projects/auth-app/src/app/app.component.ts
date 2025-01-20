import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MenuComponent } from './components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoginComponent,RegisterComponent,MenuComponent,RouterModule,CommonModule,SidebarModule,ButtonModule,MenubarModule,DropdownModule,InputTextModule],
  templateUrl: './app.component.html',
  standalone:true,
  styleUrl: './app.component.css',
  animations: [] // <-- Don't forget!
})
export class AppComponent implements OnInit{

    visibleSidebar: boolean = false;
    menuItems: any[] | undefined;
    constructor(private router: Router) {
    }
    ngOnInit() {
      this.menuItems = [
        { label: 'Home', icon: 'pi pi-home', command: () => this.navigateTo('home') },
        { label: 'About', icon: 'pi pi-info-circle', command: () => this.navigateTo('about') },
        { label: 'Contact', icon: 'pi pi-envelope', command: () => this.navigateTo('contact') },
      ];
    }
  
    toggleSidebar() {
      this.visibleSidebar = !this.visibleSidebar;
    }
  
    navigateTo(page: string) {
      console.log(`Navigating to ${page}`);
    }
    redirectToLogin() {
      console.log('Redirecting to /auth/login');
      this.router.navigate(['register']);
    }
    
}
