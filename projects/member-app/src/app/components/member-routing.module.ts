import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateComponent } from './create/create.component';
import { MemberComponent } from './member/member.component';
import { MenuComponent } from './menu/menu.component';

export const MFE1_ROUTES: Routes = [
  { path: 'menu', component: MenuComponent }, // Ensure this route is defined
  { path: 'member', component: MemberComponent }, // Ensure this route is defined
  { path: 'create', component: CreateComponent },
  { path: '', redirectTo: '/create', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'members/:id', component: DetailsComponent }
]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
