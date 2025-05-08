// salle-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  FormsModule
} from '@angular/forms';
import {
  DialogModule
} from 'primeng/dialog';
import {
  InputNumberModule
} from 'primeng/inputnumber';
import {
  InputTextModule
} from 'primeng/inputtext';
import {
  TableModule
} from 'primeng/table';
import {
  ToolbarModule
} from 'primeng/toolbar';
import {
  ToastModule
} from 'primeng/toast';
import {
  ButtonModule
} from 'primeng/button';
import {
  ConfirmDialogModule
} from 'primeng/confirmdialog';
import { Salle } from '../../models/Salle';
import { SalleService } from '../../services/salle.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import KeycloakService from '../../../../../host-app/src/app/shared/keycloak.service';

@Component({
  selector: 'app-salle-list',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    ConfirmDialogModule,
    DropdownModule
  ],
  templateUrl: './salle.component.html'})
export class SalleComponent implements OnInit {
  salles: Salle[] = [];
  salleDialog: boolean = false;
  salle: Salle = this.getEmptySalle();
  submitted: boolean = false;
  salleStatusOptions = [
    { label: 'Réservée', value: 'Reserved' },
    { label: 'Non Réservée', value: 'NorReserved' }
  ];
  
  constructor(
    private salleService: SalleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService:KeycloakService ) {}
    roles: string[] = [];

    ngOnInit() {
      this.roles = this.authService.getUserRoles(); // <- récupère les rôles
      console.log('User roles:', this.roles);    
   this.loadSalles();
}

    
  
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
  loadSalles() {
    this.salleService.getSalles().subscribe((response) => {
      this.salles = response.content;
    });
  }

  openNew() {
    this.salle = this.getEmptySalle();
    this.submitted = false;
    this.salleDialog = true;
  }

  editSalle(salle: Salle) {
    this.salle = { ...salle };
    this.salleDialog = true;
  }

  deleteSalle(salle: Salle) {
    if (!salle.id) return;

    this.confirmationService.confirm({
      message: `Voulez-vous supprimer la salle ${salle.nom} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.salleService.deleteSalle(salle.id!).subscribe(() => {
          this.salles = this.salles.filter((s) => s.id !== salle.id);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Salle supprimée' });
        });
      }
    });
  }

  saveSalle() {
    this.submitted = true;
    if (!this.salle.nom || !this.salle.capacite) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs.' });
      return;
    }

    if (this.salle.id) {
      this.salleService.updateSalle(this.salle.id, this.salle).subscribe(() => {
        this.loadSalles();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Salle mise à jour' });
      });
    } else {
      this.salleService.createSalle(this.salle).subscribe(() => {
        this.loadSalles();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Salle créée' });
      });
    }

    this.salleDialog = false;
  }

  hideDialog() {
    this.salleDialog = false;
    this.submitted = false;
  }

  private getEmptySalle(): Salle {
    return {
      nom: '',
      capacite: 0
    };
  }
}
