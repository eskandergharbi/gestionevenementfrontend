
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemberService } from '../../../member.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MemberComponent } from '../member/member.component';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [  InputTextModule,
      ButtonModule,
      DropdownModule,
      CardModule, 
      MemberComponent,
      DialogModule,
      PanelModule,
      ConfirmDialogModule,FormsModule,CommonModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers:[MessageService,ConfirmationService]
})
export class CreateComponent implements OnInit {
  members: any[] = [];
  memberDialog: boolean = false;
  member: any = { name: '', email: '' };
  dialogTitle: string = '';

  constructor(private memberService: MemberService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.memberService.getAllMembers().subscribe((data) => (this.members = data));
  }

  openNew(): void {
    this.member = { name: '', email: '' }; // Reset member object
    this.dialogTitle = 'Add New Member';
    this.memberDialog = true;
  }

  editMember(member: any): void {
    this.member = { ...member }; // Copy the member object to edit
    this.dialogTitle = 'Edit Member';
    this.memberDialog = true;
  }

  saveMember(): void {
    if (this.member._id) {
      // Update existing member
      this.memberService.updateMember(this.member._id, this.member).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Member updated successfully' });
        this.loadMembers(); // Refresh the member list
        this.memberDialog = false;
      });
    } else {
      // Create new member
      this.memberService.createMember(this.member).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Member added successfully' });
        this.loadMembers(); // Refresh the member list
        this.memberDialog = false;
      });
    }
  }

  hideDialog(): void {
    this.memberDialog = false; // Close the dialog
  }

}

