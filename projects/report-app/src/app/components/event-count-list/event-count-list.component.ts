import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { KeycloakService } from '../../../../../host-app/src/app/shared/keycloak.service';

interface EventCountDTO {
  eventId: string;
  participantCount: number;
  capacite?: number;
}

@Component({
  selector: 'app-event-count-list',
  standalone: true,
  imports: [CommonModule, CardModule, ProgressBarModule],
  template: `
    <h2 style="margin-bottom: 1rem;">Taux de participation par événement</h2>
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-4" *ngFor="let event of events">
        <p-card header="Événement" styleClass="mb-3">
          <p><strong>Participants:</strong> {{ event.participantCount }}</p>

          <ng-container *ngIf="event.capacite">
            <p><strong>Capacité:</strong> {{ event.capacite }}</p>
            <p-progressBar [value]="calculateTaux(event)" [showValue]="true"></p-progressBar>
            <p class="mt-2">Taux de participation : {{ calculateTaux(event) | number:'1.0-0' }}%</p>
          </ng-container>
        </p-card>
      </div>
    </div>
  `
})
export class EventCountListComponent implements OnInit {
  events: EventCountDTO[] = [];
  roles: string[] = [];

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.roles = this.keycloakService.getUserRoles();
    console.log(this.roles);

    const token = this.keycloakService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<EventCountDTO[]>('http://localhost:8088/api/registrations/participants', { headers })
      .subscribe(data => {
        this.events = data.map(e => ({
          ...e,
          capacite: 50 // Temporary static capacity value
        }));
        console.log(this.events);
      });
  }

  calculateTaux(event: EventCountDTO): number {
    if (!event.capacite || event.capacite === 0) return 0;
    return (event.participantCount / event.capacite) * 100;
  }
}
