import { NgModule } from '@angular/core';
import { AppComponent } from './src/app/app.component';
import { routes } from '../collaboration-app/src/app/app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],

})
export class AppModule { }