import { NgModule } from '@angular/core';
import { AppComponent } from './src/app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './src/app/app-routing.module';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES)
  ],

})
export class AppModule { }