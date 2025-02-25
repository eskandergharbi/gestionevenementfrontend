import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../../../../task-app/auth.guard';
import { LoginComponent } from '../../../../auth-app/src/app/components/login/login.component';




export const MFE1_ROUTES: Routes = [
   { path: 'dashboard', component: DashboardComponent , canActivate: [authGuard]},
      { path: 'login', component: LoginComponent }
   
]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
