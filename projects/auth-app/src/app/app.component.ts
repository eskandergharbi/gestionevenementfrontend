import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { AboutComponent } from './components/about/about.component';
import { HelloApiService } from './hello-api.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule,CommonModule,SidebarModule,ButtonModule,MenubarModule,DropdownModule,InputTextModule],
  templateUrl: './app.component.html',
  
  styleUrl: './app.component.css',
  animations: [] // <-- Don't forget!
})
export class AppComponent {
}
