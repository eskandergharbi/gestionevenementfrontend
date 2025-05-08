import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule here
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';  // Ensure MultiSelectModule is imported
import { SalleService } from '../../services/salle.service';
import { ReservationService } from '../../services/reservation.service';
import { EquipementService } from '../../services/equipement.service';
import { Salle } from '../../models/Salle';
import { Equipement } from '../../models/equipement';
import { Reservation } from '../../models/reservation';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../../../../host-app/src/app/shared/keycloak.service';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    ButtonModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,       // Ensure FormsModule is included
    ReactiveFormsModule,  // Include ReactiveFormsModule
    ConfirmDialogModule,
    DropdownModule,
    CommonModule,
    MultiSelectModule  // Include MultiSelectModule if using p-multiselect
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './reservation.component.html'
})
export class ReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  reservationDialog: boolean = false;
  reservation: Reservation = this.getEmptyReservation();
  submitted: boolean = false;
  salles: Salle[] = [];
  equipements: Equipement[] = [];
  
  constructor(
    private reservationService: ReservationService,
    private salleService: SalleService,
    private equipementService: EquipementService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  private keycloakService: KeycloakService  ) {}
    roles: string[] = [];

  ngOnInit() {
    this.roles = this.keycloakService.getUserRoles();
    console.log(this.roles);
    this.loadReservations();
    this.loadSalles();
    this.loadEquipements();
    // Removed assignment in template, initializing it here.
    this.reservation.startTime = new Date();
    this.reservation.endTime = new Date();
  }

  loadReservations() {
    this.reservationService.getReservations().subscribe((response) => {
      this.reservations = response.content;
    });
  }
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
  loadSalles() {
    this.salleService.getSalles().subscribe((response) => {
      this.salles = response.content;
    });
  }

  loadEquipements() {
    this.equipementService.getEquipements().subscribe((response) => {
      this.equipements = response.content;
      console.log(this.equipements);
      
    });
  }
  loadEquipementsBySalle(id:number) {
    this.equipementService.getEquipementsBySalleId(id).subscribe((response) => {
      this.equipements = response.content;
      console.log(this.equipements);
      
    });
  }
  openNew() {
    this.reservation = this.getEmptyReservation();
    this.submitted = false;
    this.reservationDialog = true;
  }

  editReservation(reservation: Reservation) {
    this.reservation = { ...reservation };
    this.reservationDialog = true;
  }

  deleteReservation(reservation: Reservation) {
    if (!reservation.id) return;

    this.confirmationService.confirm({
      message: `Voulez-vous supprimer la réservation ${reservation.id} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reservationService.deleteReservation(reservation.id!).subscribe(() => {
          this.reservations = this.reservations.filter((r) => r.id !== reservation.id);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Réservation supprimée' });
        });
      }
    });
  }

  saveReservation() {
    this.submitted = true;
    if (!this.reservation.startTime || !this.reservation.endTime || !this.reservation.salle) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs.' });
      return;
    }

    if (this.reservation.id) {
      this.reservationService.updateReservation(this.reservation.id, this.reservation).subscribe(() => {
        this.loadReservations();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Réservation mise à jour' });
      });
    } else {
      this.reservationService.createReservation(this.reservation).subscribe(() => {
        this.loadReservations();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Réservation créée' });
      });
    }

    this.reservationDialog = false;
  }

  hideDialog() {
    this.reservationDialog = false;
    this.submitted = false;
  }

  getEquipementsString(reservation: Reservation): string {
    return reservation.equipements?.map(e => e.nom).join(', ') || '';
  }

  private getEmptyReservation(): Reservation {
    return {
      idescription:'',
      startTime: new Date(),
      endTime: new Date(),
      salle: this.salles?.length > 0 ? this.salles[0] : {} as Salle,  // Avoid null
      equipements: []
    };
  }
}
