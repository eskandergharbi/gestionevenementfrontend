import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MemberComponent } from '../member/member.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../../member.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [  InputTextModule,
    TableModule,
      ButtonModule,
      DropdownModule,
      CardModule, // Ensure CardModule is imported
      MemberComponent,
      DialogModule,
      PanelModule,
      ConfirmDialogModule,FormsModule,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[MessageService,ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  members: any[] = [];
  memberDialog: boolean = false;
  member: any = { name: '', email: '' };
  dialogTitle: string = '';
  detailsDialog: boolean = false; // For showing member details
  selectedMember: any = null; // Holds the selected member's details
  constructor(
    private memberService: MemberService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.memberService.getAllMembers().subscribe((data:any) => (this.members = data));
  }

  openNew(): void {
    this.member = { name: '', email: '' };
    this.dialogTitle = 'Add New Member';
    this.memberDialog = true;
  }
  hideDetailsDialog(): void {
    this.detailsDialog = false;
  }
  showDetails(member: any): void {
    this.selectedMember = { ...member }; // Clone the selected member
    this.detailsDialog = true;
  }
  editMember(member: any): void {
    this.member = { ...member };
    this.dialogTitle = 'Edit Member';
    this.memberDialog = true;
  }

  saveMember(): void {
    if (this.member._id) {
      // Update existing member
      this.memberService.updateMember(this.member._id, this.member).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Member updated successfully' });
        this.loadMembers();
        this.memberDialog = false;
      });
    } else {
      // Create new member
      this.memberService.createMember(this.member).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Member added successfully' });
        this.loadMembers();
        this.memberDialog = false;
      });
    }
  }

  deleteMember(member: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this member?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.memberService.deleteMember(member._id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Member deleted successfully' });
          this.loadMembers();
        });
      },
    });
  }

  hideDialog(): void {
    this.memberDialog = false;
  }
}
