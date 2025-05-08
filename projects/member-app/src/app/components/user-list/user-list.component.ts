import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { MemberService, User } from '../../../member.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeycloakService } from '../../../../../host-app/src/app/shared/keycloak.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  providers: [ConfirmationService, MessageService,MemberService],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [
    ButtonModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    ConfirmDialogModule,
    CommonModule
  ]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser: User = this.getEmptyUser();
  displayDialog: boolean = false;
  submitted: boolean = false;
  newUser: boolean = false;

  constructor(
    private userService: MemberService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private keycloakService: KeycloakService  ) {}
    roles: string[] = [];

  ngOnInit() {
    this.roles = this.keycloakService.getUserRoles();
    console.log(this.roles);
    
    this.loadUsers();
  }
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe((response) => {
      this.users = response.content;
    });
  }

  openNew(): void {
    this.selectedUser = this.getEmptyUser();
    this.submitted = false;
    this.newUser = true;
    this.displayDialog = true;
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.newUser = false;
    this.displayDialog = true;
  }

  deleteUser(user: User): void {
    if (!user.id) return;

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(user.id!).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé' });
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
            console.error('Deletion error:', error);
          }
        });
      }
    });
  }

  saveUser(): void {
    this.submitted = true;

    if (!this.selectedUser.firstName || !this.selectedUser.lastName || !this.selectedUser.email) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs' });
      return;
    }

    if (this.newUser) {
      this.userService.createUser(this.selectedUser).subscribe(() => {
        this.loadUsers();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur ajouté' });
      });
    } else {
      this.userService.updateUser(this.selectedUser.id!, this.selectedUser).subscribe(() => {
        this.loadUsers();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur mis à jour' });
      });
    }

    this.displayDialog = false;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.submitted = false;
  }

  private getEmptyUser(): User {
    return {
      id: '',
      firstName: '',
      lastName: '',
      email: ''
    };
  }
}
