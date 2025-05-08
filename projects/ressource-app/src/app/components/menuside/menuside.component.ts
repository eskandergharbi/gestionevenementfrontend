import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { UserListComponent } from '../user-list/user-list.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-menuside',
  standalone: true,
  imports: [SidebarModule, ButtonModule,  RouterModule,UserListComponent,RegisterComponent],
  templateUrl: './menuside.component.html',
  styleUrl: './menuside.component.css'
})
export class MenusideComponent {
  sidebarVisible: boolean = false;

}
