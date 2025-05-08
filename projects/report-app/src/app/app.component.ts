import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventCountListComponent } from './components/event-count-list/event-count-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,DashboardComponent,EventCountListComponent],
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'report-app';
}
