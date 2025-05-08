import { Component, OnInit } from '@angular/core';

import { MessageService, ConfirmationService } from 'primeng/api';
import { EventService } from '../../../../../event-app/src/app/event.service';
import { RegistrationService } from '../../../registration.service';
import { Event } from '../../../../../event-app/src/app/event';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { KeycloakService } from '../../../../../host-app/src/app/shared/keycloak.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
    imports: [  
      FormsModule,
      CommonModule,
      DropdownModule,
      InputTextModule,
      ButtonModule,
      CardModule,
    ToastModule],
  styleUrls: ['./register.component.css'],
  standalone:true,
  providers: [MessageService, ConfirmationService]
})
export class RegisterComponent implements OnInit {
  events: Event[] = [];
  selectedEvent!: Event ;
  userEmail: string = '';

  constructor(
    private eventService: EventService,
    private registrationService: RegistrationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  private keycloakService: KeycloakService  ) {}
    roles: string[] = [];

  ngOnInit() {
    this.roles = this.keycloakService.getUserRoles();
    this.loadEvents();
  }
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
  loadEvents() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events.content;
      console.log(this.events);
      
    });
  }

  register() {
    if (!this.selectedEvent || !this.userEmail) {
      this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Sélectionnez un événement et entrez un email' });
      console.log("zzzzz");
      return;
      
    }

    this.registrationService.registerUser(this.selectedEvent.id!, this.userEmail).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Inscription réussie', detail: 'Vous êtes inscrit à l’événement' });
    });
  }

  cancel() {
    if (!this.selectedEvent || !this.userEmail) {
      this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Sélectionnez un événement et entrez un email' });
      return;
    }

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir annuler votre inscription à ${this.selectedEvent.name} ?`,
      accept: () => {
        this.registrationService.cancelRegistration(this.selectedEvent!.id!, this.userEmail!).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Annulation réussie', detail: 'Votre inscription a été annulée' });
        });
      }
    });
  }
}
