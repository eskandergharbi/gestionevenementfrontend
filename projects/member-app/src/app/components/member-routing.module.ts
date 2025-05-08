import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { MenusideComponent } from './menuside/menuside.component';
import { UserListComponent } from './user-list/user-list.component';

export const MFE1_ROUTES: Routes = [
  
  { path: 'menu', component: MenusideComponent }, // Ensure this route is defined
  { path: 'members', component: UserListComponent }, // Ensure this route is defined
  { path: 'register', component: RegisterComponent }]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
