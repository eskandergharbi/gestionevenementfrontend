
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReportRoutingModule } from './components/report-routing.module';
import { LoginComponent } from '../../../auth-app/src/app/components/login/login.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    LoginComponent
    // Ajoutez le module de routage ici
  ]
})
export class ReportModule {}