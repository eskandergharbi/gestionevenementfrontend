import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../../member.service';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ InputTextModule,
        ButtonModule,
        DropdownModule,
        CardModule, // Ensure CardModule is imported
        DialogModule,
        PanelModule,
        ConfirmDialogModule,FormsModule,CommonModule],
  templateUrl: './details.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
  styleUrl: './details.component.css'
})
export class DetailsComponent  implements OnInit {
  member: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.memberService.getMemberById(id).subscribe((data) => (this.member = data));
    }
  }

  goBack(): void {
    this.router.navigate(['/members']); // Navigate back to the list
  }
}

