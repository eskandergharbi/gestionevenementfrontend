import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Equipement } from '../../models/equipement';
import { EquipementService } from '../../services/equipement.service';
import { SalleService } from '../../services/salle.service';
import { Salle } from '../../models/Salle';
import { DropdownModule } from 'primeng/dropdown';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../../../../host-app/src/app/shared/keycloak.service';

@Component({
  selector: 'app-equipement',
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
    FormsModule,
    ConfirmDialogModule,
    DropdownModule,
    CommonModule
  ],
  templateUrl: './equipement.component.html'
})
export class EquipementComponent implements OnInit {
    reservations: Reservation[] = [];
  equipements: Equipement[] = [];
  equipementDialog: boolean = false;
  equipement: Equipement = this.getEmptyEquipement();
  submitted: boolean = false;
  salles: Salle[] = [];

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
    
    this.loadEquipements();
    this.loadSalles();
    this.loadReservations();
  }
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
  loadEquipements() {
    this.equipementService.getEquipements().subscribe((response) => {
      this.equipements = response.content;
    });

  }

  loadSalles() {
    this.salleService.getSalles().subscribe(data => {
      this.salles = data.content || [];
      console.log(this.salles);
      
    });
    
  }

  openNew() {
    this.equipement = this.getEmptyEquipement();
    this.submitted = false;
    this.equipementDialog = true;
    console.log(this.equipementDialog = true);
    
  }
  loadReservations() {
    this.reservationService.getReservations().subscribe((response) => {
      this.reservations = response.content;
      console.log(this.reservations);
      
    });
  }
  editEquipement(equipement: Equipement) {
    this.equipement = { ...equipement };
    this.equipementDialog = true;
  }

  deleteEquipement(equipement: Equipement) {
    if (equipement.id === undefined) return;

    this.confirmationService.confirm({
      message: `Do you want to delete ${equipement.nom}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.equipementService.deleteEquipement(equipement.id!).subscribe(() => {
          this.equipements = this.equipements.filter(e => e.id !== equipement.id);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Equipement deleted' });
        });
      }
    });
  }

  saveEquipement() {
    this.submitted = true;

    if (!this.equipement.nom || !this.equipement.quantite || !this.equipement.salleid || !this.equipement.reservationid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });
        return;
    }

    // Create a new object with Salle and Reservation references
    const equipementToSave = {
        nom: this.equipement.nom,
        quantite: this.equipement.quantite,
        salle: { id: this.equipement.salleid }, // Create Salle object with ID
        reservation: { id: this.equipement.reservationid } // Create Reservation object with ID
    };

    if (this.equipement.id) {
        this.equipementService.updateEquipement(this.equipement.id, equipementToSave).subscribe({
            next: () => {
                this.loadEquipements();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Equipement updated' });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update equipement' });
            }
        });
    } else {
        this.equipementService.createEquipement(equipementToSave).subscribe({
            next: () => {
                this.loadEquipements();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Equipement added' });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add equipement' });
            }
        });
    }

    this.equipementDialog = false;
}

  hideDialog() {
    this.equipementDialog = false;
    this.submitted = false;
  }

  private getEmptyEquipement(): Equipement {
    return { nom: '', quantite: 0, salleid: undefined, reservationid: undefined };
  }
  
}
