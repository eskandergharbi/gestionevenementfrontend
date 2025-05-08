import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SalleComponent } from './salle/salle.component';
import { EquipementComponent } from './equipement/equipement.component';
import { ReservationComponent } from './reservation/reservation.component';



export const MFE1_ROUTES: Routes = [
   { path: 'salle', component: SalleComponent },
   { path: 'equipement', component: EquipementComponent },
   { path: 'reservesalle', component: ReservationComponent },

]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class ressourceRoutingModule { }
