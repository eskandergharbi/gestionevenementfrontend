import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportModule } from './report.module';

export const routes: Routes = [  {
    path: 'report',
    loadChildren: () => import('./components/report.module').then(m => m.ReportModule) // Lazy load AuthModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),ReportModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }