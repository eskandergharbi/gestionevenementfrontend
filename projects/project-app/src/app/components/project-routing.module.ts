import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { authGuard } from '../../../../task-app/auth.guard';


export const MFE1_ROUTES: Routes = [
   { path: 'list', component: ProjectListComponent },
   { path: 'create', component: ProjectFormComponent, canActivate: [authGuard] },
   { path: 'details', component: ProjectDetailComponent },
   { path: 'menu', component: MenuComponent }
]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
