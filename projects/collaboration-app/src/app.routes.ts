import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [  {
    path: 'collaboration',
    loadChildren: () => import('./app/components/Communication.module').then(m => m.CommunicationModule) // Lazy load AuthModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }