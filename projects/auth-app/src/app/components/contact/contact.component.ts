import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule,CardModule,ButtonModule,CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit(): void {
    if (this.contact.name && this.contact.email && this.contact.subject && this.contact.message) {
      console.log('Form submitted:', this.contact);
      alert('Thank you for contacting us. We will get back to you shortly.');
      // Reset the form
      this.contact = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }
  }
}
