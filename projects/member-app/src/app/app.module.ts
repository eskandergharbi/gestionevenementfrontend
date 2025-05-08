import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import {  HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { AppRoutingModule } from '../../../auth-app/src/app/app.routes';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ButtonModule,
    SidebarModule,
    BrowserAnimationsModule,
    MenubarModule, // Add this
    HttpClientModule,
    RouterModule, 
    DropdownModule,
    CardModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    ToastModule,
    TableModule, DialogModule, ButtonModule
// Import RouterModule 
  ],
  declarations: [],
  providers: [MessageService],
  bootstrap: []
})
export class AppModule { }