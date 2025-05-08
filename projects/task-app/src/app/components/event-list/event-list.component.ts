import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../../../../host-app/src/app/shared/keycloak.service';
import { EventService } from '../../../event.service';
import { Event } from '../../../event';

@Component({
  selector: 'app-event-list',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    ConfirmDialogModule
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  eventDialog: boolean = false;
  event: Event = this.getEmptyEvent();
  submitted: boolean = false;
  statuses = ['OUVERT', 'FERME', 'COMPLET', 'ANNULE'];

  constructor(
    private eventService: EventService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private keycloakService: KeycloakService  ) {}
    roles: string[] = [];

  ngOnInit() {
    this.roles = this.keycloakService.getUserRoles();
    console.log(this.roles);
    
    this.loadEvents();
    console.log(this.loadEvents());
  }
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
  loadEvents() {
    this.eventService.getEvents().subscribe((response) => {
      this.events = response.content;
    });
  }

  openNew() {
    this.event = this.getEmptyEvent();
    this.submitted = false;
    this.eventDialog = true;
  }

  editEvent(event: Event) {
    this.event = { ...event };
    this.eventDialog = true;
  }

  deleteEvent(event: Event) {
    console.log('Trying to delete event:', event);
    if (!event.id) {
      console.error('Event ID is undefined');
      return;
    }

    this.confirmationService.confirm({
      message: `Voulez-vous supprimer ${event.name} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eventService.deleteEvent(event.id!).subscribe(() => {
          this.events = this.events.filter((e) => e.id !== event.id);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Événement supprimé' });
        }, error => {
          console.error('Erreur lors de la suppression', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
        });
      }
    });
  }

  saveEvent() {
    this.submitted = true;

    if (!this.event.name || !this.event.category) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }

    if (this.event.id) {
      this.eventService.updateEvent(this.event.id, this.event).subscribe(() => {
        this.loadEvents();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Événement mis à jour' });
      });
    } else {
      this.eventService.createEvent(this.event).subscribe(() => {
        this.loadEvents();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Événement créé' });
      });
    }

    this.eventDialog = false;
  }

  hideDialog() {
    this.eventDialog = false;
    this.submitted = false;
  }

  private getEmptyEvent(): Event {
    return {
      name: '',
      category: '',
      eventStatus: 'OUVERT',
      participantCount: 0,
      maxParticipants: 0
    };
  }
}
