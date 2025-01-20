
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule // Ajoutez le module de routage ici
  ]
})
export class ReportModule {}