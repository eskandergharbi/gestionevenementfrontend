import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CollaborationRoutingModule } from './Communication-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import {  ConfirmDialogModule } from 'primeng/confirmdialog';

import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card'; // Import CardModule
import { MenuComponent } from './menu/menu.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    SidebarModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    CollaborationRoutingModule,
    MenuComponent,
    ConfirmDialogModule
  ],
  providers: []// add it here


})
export class CommunicationModule { }