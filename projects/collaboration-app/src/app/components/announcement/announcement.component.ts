import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AnnouncementService } from '../../../../services/annoucement.service';
import { Announcement } from '../../../../models/annoucement';

import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { KeycloakService } from '../../../../../host-app/src/app/shared/keycloak.service';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    TableModule,
    InputTextModule,
    InputTextModule
  ],
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService, ConfirmationService]
})
export class AnnouncementComponent implements OnInit {
  announcement: Announcement = { title: '', content: '' };
  announcements: Announcement[] = [];
  editMode = false;
  currentId: number | null = null;
  showDialog = false;

  constructor(
    private announcementService: AnnouncementService,
    private messageService: MessageService,
    private confirm: ConfirmationService,
private keycloakService: KeycloakService  ) {}
    roles: string[] = [];

  ngOnInit() {
    this.roles = this.keycloakService.getUserRoles();
    this.loadAnnouncements();
    console.log(this.roles);
    
  }
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
  loadAnnouncements() {
    this.announcementService.getAll().subscribe(data => this.announcements = data);
  }

  openNewDialog() {
    this.editMode = false;
    this.announcement = { title: '', content: '' };
    this.showDialog = true;
  }

  sendAnnouncement() {
    this.announcementService.postAnnouncement(this.announcement).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sent', detail: 'Announcement posted!' });
        this.announcement = { title: '', content: '' };
        this.showDialog = false;
        this.loadAnnouncements();
      }
    });
  }

  edit(ann: Announcement) {
    this.announcement = { ...ann };
    this.currentId = ann.id!;
    this.editMode = true;
    this.showDialog = true;
  }

  updateAnnouncement() {
    if (this.currentId != null) {
      this.announcementService.updateAnnouncement(this.currentId, this.announcement).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Announcement updated!' });
          this.announcement = { title: '', content: '' };
          this.editMode = false;
          this.currentId = null;
          this.showDialog = false;
          this.loadAnnouncements();
        }
      });
    }
  }

  confirmDelete(ann: Announcement) {
    this.confirm.confirm({
      message: `Are you sure you want to delete "${ann.title}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteAnnouncement(ann.id!)
    });
  }

  deleteAnnouncement(id: number) {
    this.announcementService.deleteAnnouncement(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Announcement deleted!' });
        this.loadAnnouncements();
      }
    });
  }
}
