import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [  {
    path: 'collaboration',
    loadChildren: () => import('../src/app/components/collaboration.module').then(m => m.CollaborationModule) // Lazy load AuthModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }