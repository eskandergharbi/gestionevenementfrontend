import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { EventCountListComponent } from './event-count-list/event-count-list.component';




export const MFE1_ROUTES: Routes = [

  { path: 'count', component: EventCountListComponent },
  { path: '', redirectTo: 'count', pathMatch: 'full' }, // redirection par défaut (optionnel)
  { path: '**', redirectTo: 'count' } // gestion des routes inconnues   
]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
