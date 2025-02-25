import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { authGuard } from '../../../auth.guard';
import { LoginComponent } from '../../../../auth-app/src/app/components/login/login.component';
import { DashboardsComponent } from '../../../../auth-app/src/app/components/dashboards/dashboards.component';


export const MFE1_ROUTES: Routes = [
   { path: 'list', component: TaskListComponent },
   { path: 'create', component: TaskFormComponent, canActivate: [authGuard] },
   { path: 'menu', component: MenuComponent },
   { path: 'login', component: LoginComponent },
   { path: 'dashboard', component: DashboardsComponent },

]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
