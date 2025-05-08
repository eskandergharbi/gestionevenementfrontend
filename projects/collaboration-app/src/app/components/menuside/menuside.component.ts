import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ChatComponent } from '../chat/chat.component';
import { AnnouncementComponent } from '../announcement/announcement.component';


@Component({
  selector: 'app-menuside',
  standalone: true,
  imports: [SidebarModule, ButtonModule,  RouterModule,ChatComponent,AnnouncementComponent],
  templateUrl: './menuside.component.html',
  styleUrl: './menuside.component.css'
})
export class MenusideComponent {
  sidebarVisible: boolean = false;

}
