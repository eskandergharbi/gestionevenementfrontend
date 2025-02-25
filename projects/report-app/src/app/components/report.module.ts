import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReportRoutingModule } from './report-routing.module';
import {  RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import {  HttpClientModule } from '@angular/common/http';

import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card'; // Import CardModule
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
    ReportRoutingModule 
       ],
     providers: []// add it here


})
export class ReportModule {}