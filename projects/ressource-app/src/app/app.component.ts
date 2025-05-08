import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ReservationComponent } from './components/reservation/reservation.component';
import { EquipementComponent } from './components/equipement/equipement.component';
import { SalleComponent } from './components/salle/salle.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule,CommonModule,FormsModule,ButtonModule],
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project-app';
}
