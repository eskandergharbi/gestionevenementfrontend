import { Component, OnInit } from '@angular/core';
import {SidebarModule} from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
    standalone: true,
    imports: [CardModule,RouterModule,CommonModule,SidebarModule,ButtonModule,MenubarModule]
})
export class MenuComponent implements OnInit {

    visibleSidebar: boolean = false;
    menuItems: any[] | undefined;
    constructor(private router: Router) {
    }
    ngOnInit() {
      this.menuItems = [
        { label: 'Home', icon: 'pi pi-home', command: () => this.navigateTo('/create') },
        { label: 'About', icon: 'pi pi-info-circle', command: () => this.navigateTo('/list') },
        // { label: 'Contact', icon: 'pi pi-envelope', command: () => this.navigateTo('/contact') },
      ];
    }
  
    toggleSidebar() {
      this.visibleSidebar = !this.visibleSidebar;
    }
  
   
    redirectToLogin() {
      console.log('Redirecting to /auth/login');
      this.router.navigate(['login']);
    }
    navigateTo(route: string) {
      this.router.navigate([route]);
      console.log("dazo",route);
    
    }
    loadMicrofrontend(appName: string) {
      switch (appName) {
        case 'auth-app':
          this.router.navigateByUrl('/auth');
          break;
        case 'products-app':
          this.router.navigateByUrl('/products');
          break;
        case 'report-app':
          this.router.navigateByUrl('/reports');
          break;
        default:
          console.error('Unknown microfrontend:', appName);
      }
      this.visibleSidebar = false;
    }
  }