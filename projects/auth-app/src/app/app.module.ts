import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes, AppRoutingModule } from './app.routes';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    ButtonModule,
    SidebarModule,
    BrowserAnimationsModule,
    MenubarModule, // Add this
    HttpClientModule,
    AppRoutingModule, // Add your routing module here
    RouterModule, 
    DropdownModule,
    CardModule// Import RouterModule 
  ],
  declarations: [],
  providers: [HttpClient],
  bootstrap: []
})
export class AppModule { }